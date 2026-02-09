from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'izo-iptv-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI(title="Izo IPTV API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Package(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Dict[str, str]  # {sq: "", de: "", en: ""}
    price: float
    currency: str = "€"
    period: Dict[str, str]  # {sq: "muaj", de: "Monat", en: "month"}
    features: Dict[str, List[str]]  # {sq: [], de: [], en: []}
    is_popular: bool = False
    order: int = 0

class PackageCreate(BaseModel):
    name: Dict[str, str]
    price: float
    currency: str = "€"
    period: Dict[str, str]
    features: Dict[str, List[str]]
    is_popular: bool = False
    order: int = 0

class FAQ(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: Dict[str, str]
    answer: Dict[str, str]
    order: int = 0
    is_active: bool = True

class FAQCreate(BaseModel):
    question: Dict[str, str]
    answer: Dict[str, str]
    order: int = 0
    is_active: bool = True

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    text: Dict[str, str]
    rating: int = 5
    image_url: str = ""
    is_active: bool = True
    order: int = 0

class TestimonialCreate(BaseModel):
    name: str
    location: str
    text: Dict[str, str]
    rating: int = 5
    image_url: str = ""
    is_active: bool = True
    order: int = 0

class SiteContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str  # unique identifier like "hero_title", "about_text"
    content: Dict[str, Any]  # {sq: "", de: "", en: ""} or complex structures
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SiteContentUpdate(BaseModel):
    content: Dict[str, Any]

class ContactInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    whatsapp: str
    telegram: str
    email: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactInfoUpdate(BaseModel):
    whatsapp: str
    telegram: str
    email: str

class ImageUpload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    data: str  # base64 encoded
    content_type: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============ HELPER FUNCTIONS ============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        admin = await db.admins.find_one({"username": username}, {"_id": 0})
        if admin is None:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ AUTH ROUTES ============

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: AdminLogin):
    admin = await db.admins.find_one({"username": data.username}, {"_id": 0})
    if not admin or not verify_password(data.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": admin["username"]})
    return TokenResponse(access_token=token)

@api_router.post("/auth/setup")
async def setup_admin():
    """Create default admin if none exists"""
    existing = await db.admins.find_one({})
    if existing:
        raise HTTPException(status_code=400, detail="Admin already exists")
    admin = AdminUser(
        username="admin",
        password_hash=get_password_hash("admin123")
    )
    doc = admin.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.admins.insert_one(doc)
    return {"message": "Admin created", "username": "admin", "password": "admin123"}

@api_router.get("/auth/me")
async def get_me(admin: dict = Depends(get_current_admin)):
    return {"username": admin["username"]}

# ============ PACKAGES ROUTES ============

@api_router.get("/packages", response_model=List[Package])
async def get_packages():
    packages = await db.packages.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return packages

@api_router.post("/packages", response_model=Package)
async def create_package(data: PackageCreate, admin: dict = Depends(get_current_admin)):
    package = Package(**data.model_dump())
    doc = package.model_dump()
    await db.packages.insert_one(doc)
    return package

@api_router.put("/packages/{package_id}", response_model=Package)
async def update_package(package_id: str, data: PackageCreate, admin: dict = Depends(get_current_admin)):
    result = await db.packages.update_one(
        {"id": package_id},
        {"$set": data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    updated = await db.packages.find_one({"id": package_id}, {"_id": 0})
    return updated

@api_router.delete("/packages/{package_id}")
async def delete_package(package_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.packages.delete_one({"id": package_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"message": "Package deleted"}

# ============ FAQ ROUTES ============

@api_router.get("/faqs", response_model=List[FAQ])
async def get_faqs():
    faqs = await db.faqs.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return faqs

@api_router.get("/faqs/all", response_model=List[FAQ])
async def get_all_faqs(admin: dict = Depends(get_current_admin)):
    faqs = await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return faqs

@api_router.post("/faqs", response_model=FAQ)
async def create_faq(data: FAQCreate, admin: dict = Depends(get_current_admin)):
    faq = FAQ(**data.model_dump())
    doc = faq.model_dump()
    await db.faqs.insert_one(doc)
    return faq

@api_router.put("/faqs/{faq_id}", response_model=FAQ)
async def update_faq(faq_id: str, data: FAQCreate, admin: dict = Depends(get_current_admin)):
    result = await db.faqs.update_one(
        {"id": faq_id},
        {"$set": data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    updated = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    return updated

@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted"}

# ============ CONTACT MESSAGES ROUTES ============

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(data: ContactMessageCreate):
    message = ContactMessage(**data.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return message

@api_router.get("/contact/messages", response_model=List[ContactMessage])
async def get_contact_messages(admin: dict = Depends(get_current_admin)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for msg in messages:
        if isinstance(msg['created_at'], str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    return messages

@api_router.put("/contact/messages/{message_id}/read")
async def mark_message_read(message_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.contact_messages.update_one(
        {"id": message_id},
        {"$set": {"is_read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Marked as read"}

@api_router.delete("/contact/messages/{message_id}")
async def delete_contact_message(message_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted"}

# ============ TESTIMONIALS ROUTES ============

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return testimonials

@api_router.get("/testimonials/all", response_model=List[Testimonial])
async def get_all_testimonials(admin: dict = Depends(get_current_admin)):
    testimonials = await db.testimonials.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return testimonials

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(data: TestimonialCreate, admin: dict = Depends(get_current_admin)):
    testimonial = Testimonial(**data.model_dump())
    doc = testimonial.model_dump()
    await db.testimonials.insert_one(doc)
    return testimonial

@api_router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, data: TestimonialCreate, admin: dict = Depends(get_current_admin)):
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    return updated

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted"}

# ============ SITE CONTENT ROUTES ============

@api_router.get("/content")
async def get_all_content():
    content = await db.site_content.find({}, {"_id": 0}).to_list(1000)
    return {item["key"]: item["content"] for item in content}

@api_router.get("/content/{key}")
async def get_content(key: str):
    content = await db.site_content.find_one({"key": key}, {"_id": 0})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@api_router.put("/content/{key}")
async def update_content(key: str, data: SiteContentUpdate, admin: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    await db.site_content.update_one(
        {"key": key},
        {"$set": {"content": data.content, "updated_at": now}},
        upsert=True
    )
    return {"message": "Content updated"}

# ============ CONTACT INFO ROUTES ============

@api_router.get("/contact-info")
async def get_contact_info():
    info = await db.contact_info.find_one({}, {"_id": 0})
    if not info:
        # Return default
        return {
            "whatsapp": "+383 49 123 456",
            "telegram": "@izoiptv",
            "email": "info@izoip.tv"
        }
    return info

@api_router.put("/contact-info")
async def update_contact_info(data: ContactInfoUpdate, admin: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    await db.contact_info.update_one(
        {},
        {"$set": {**data.model_dump(), "updated_at": now}},
        upsert=True
    )
    return {"message": "Contact info updated"}

# ============ IMAGE UPLOAD ROUTES ============

@api_router.post("/images/upload")
async def upload_image(file: UploadFile = File(...), admin: dict = Depends(get_current_admin)):
    contents = await file.read()
    encoded = base64.b64encode(contents).decode('utf-8')
    
    image = ImageUpload(
        name=file.filename,
        data=encoded,
        content_type=file.content_type
    )
    doc = image.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.images.insert_one(doc)
    
    return {"id": image.id, "name": image.name}

@api_router.get("/images")
async def get_images(admin: dict = Depends(get_current_admin)):
    images = await db.images.find({}, {"_id": 0, "data": 0}).sort("created_at", -1).to_list(100)
    for img in images:
        if isinstance(img.get('created_at'), str):
            img['created_at'] = datetime.fromisoformat(img['created_at'])
    return images

@api_router.get("/images/{image_id}")
async def get_image(image_id: str):
    image = await db.images.find_one({"id": image_id}, {"_id": 0})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image

@api_router.delete("/images/{image_id}")
async def delete_image(image_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}

# ============ SEED DATA ============

@api_router.post("/seed")
async def seed_data():
    """Seed initial data for the website"""
    
    # Check if already seeded
    existing_packages = await db.packages.count_documents({})
    if existing_packages > 0:
        return {"message": "Data already seeded"}
    
    # Seed Packages
    packages = [
        {
            "id": str(uuid.uuid4()),
            "name": {"sq": "Basic", "de": "Basic", "en": "Basic"},
            "price": 9.99,
            "currency": "€",
            "period": {"sq": "muaj", "de": "Monat", "en": "month"},
            "features": {
                "sq": ["1 pajisje", "Kanale live", "VOD bazë", "Cilësi SD/HD"],
                "de": ["1 Gerät", "Live-Kanäle", "Basis VOD", "SD/HD Qualität"],
                "en": ["1 device", "Live channels", "Basic VOD", "SD/HD quality"]
            },
            "is_popular": False,
            "order": 1
        },
        {
            "id": str(uuid.uuid4()),
            "name": {"sq": "Standard", "de": "Standard", "en": "Standard"},
            "price": 14.99,
            "currency": "€",
            "period": {"sq": "muaj", "de": "Monat", "en": "month"},
            "features": {
                "sq": ["2 pajisje", "Kanale live", "VOD i plotë", "HD & FHD", "Catch-up 7 ditë"],
                "de": ["2 Geräte", "Live-Kanäle", "Volle VOD", "HD & FHD", "7 Tage Catch-up"],
                "en": ["2 devices", "Live channels", "Full VOD", "HD & FHD", "7 days catch-up"]
            },
            "is_popular": True,
            "order": 2
        },
        {
            "id": str(uuid.uuid4()),
            "name": {"sq": "Premium", "de": "Premium", "en": "Premium"},
            "price": 19.99,
            "currency": "€",
            "period": {"sq": "muaj", "de": "Monat", "en": "month"},
            "features": {
                "sq": ["3 pajisje", "Kanale live", "VOD Premium", "4K përmbajtje", "Catch-up 14 ditë", "Mbështetje prioritare"],
                "de": ["3 Geräte", "Live-Kanäle", "Premium VOD", "4K Inhalte", "14 Tage Catch-up", "Prioritäts-Support"],
                "en": ["3 devices", "Live channels", "Premium VOD", "4K content", "14 days catch-up", "Priority support"]
            },
            "is_popular": False,
            "order": 3
        }
    ]
    await db.packages.insert_many(packages)
    
    # Seed FAQs
    faqs = [
        {
            "id": str(uuid.uuid4()),
            "question": {
                "sq": "Si funksionon IPTV?",
                "de": "Wie funktioniert IPTV?",
                "en": "How does IPTV work?"
            },
            "answer": {
                "sq": "IPTV transmetron përmbajtje televizive përmes internetit. Pas blerjes së paketës, ju do të merrni kredencialet tuaja të llogarisë që mund të përdorni në çdo aplikacion IPTV player në pajisjen tuaj.",
                "de": "IPTV überträgt Fernsehinhalte über das Internet. Nach dem Kauf eines Pakets erhalten Sie Ihre Kontodaten, die Sie in jeder IPTV-Player-App auf Ihrem Gerät verwenden können.",
                "en": "IPTV streams TV content over the internet. After purchasing a package, you will receive your account credentials that you can use in any IPTV player app on your device."
            },
            "order": 1,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "question": {
                "sq": "Në cilat pajisje punon?",
                "de": "Auf welchen Geräten funktioniert es?",
                "en": "What devices does it work on?"
            },
            "answer": {
                "sq": "Shërbimi ynë IPTV punon në pothuajse çdo pajisje: Smart TV, Android TV Box, Amazon Fire Stick, telefona dhe tableta Android/iOS, kompjutera Windows dhe Mac, dhe shumë më tepër.",
                "de": "Unser IPTV-Dienst funktioniert auf fast jedem Gerät: Smart TV, Android TV Box, Amazon Fire Stick, Android/iOS-Telefone und Tablets, Windows- und Mac-Computer und vieles mehr.",
                "en": "Our IPTV service works on almost any device: Smart TV, Android TV Box, Amazon Fire Stick, Android/iOS phones and tablets, Windows and Mac computers, and much more."
            },
            "order": 2,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "question": {
                "sq": "Si bëhet aktivizimi?",
                "de": "Wie erfolgt die Aktivierung?",
                "en": "How is activation done?"
            },
            "answer": {
                "sq": "Pas përfundimit të porosisë, do të merrni email me kredencialet tuaja brenda 1-24 orëve. Pastaj thjesht instaloni një aplikacion IPTV player dhe vendosni kredencialet për të filluar shikimin.",
                "de": "Nach Abschluss der Bestellung erhalten Sie innerhalb von 1-24 Stunden eine E-Mail mit Ihren Zugangsdaten. Installieren Sie dann einfach eine IPTV-Player-App und geben Sie die Zugangsdaten ein, um mit dem Ansehen zu beginnen.",
                "en": "After completing your order, you will receive an email with your credentials within 1-24 hours. Then simply install an IPTV player app and enter the credentials to start watching."
            },
            "order": 3,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "question": {
                "sq": "Sa shpejt aktivizohet llogaria?",
                "de": "Wie schnell wird das Konto aktiviert?",
                "en": "How fast is the account activated?"
            },
            "answer": {
                "sq": "Llogaritë zakonisht aktivizohen brenda 1-24 orëve pas konfirmimit të pagesës. Në shumicën e rasteve, aktivizimi bëhet brenda disa orëve.",
                "de": "Konten werden in der Regel innerhalb von 1-24 Stunden nach Zahlungsbestätigung aktiviert. In den meisten Fällen erfolgt die Aktivierung innerhalb weniger Stunden.",
                "en": "Accounts are typically activated within 1-24 hours after payment confirmation. In most cases, activation happens within a few hours."
            },
            "order": 4,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "question": {
                "sq": "A mund të provoj shërbimin para blerjes?",
                "de": "Kann ich den Service vor dem Kauf testen?",
                "en": "Can I try the service before buying?"
            },
            "answer": {
                "sq": "Po, ne ofrojmë prova 24-orëshe për klientët e rinj. Kontaktoni ekipin tonë përmes WhatsApp ose Telegram për të kërkuar një provë falas.",
                "de": "Ja, wir bieten 24-Stunden-Tests für Neukunden an. Kontaktieren Sie unser Team über WhatsApp oder Telegram, um einen kostenlosen Test anzufordern.",
                "en": "Yes, we offer 24-hour trials for new customers. Contact our team via WhatsApp or Telegram to request a free trial."
            },
            "order": 5,
            "is_active": True
        }
    ]
    await db.faqs.insert_many(faqs)
    
    # Seed Testimonials
    testimonials = [
        {
            "id": str(uuid.uuid4()),
            "name": "Arben K.",
            "location": "Tiranë",
            "text": {
                "sq": "Shërbim i shkëlqyer! Cilësia e transmetimit është e jashtëzakonshme dhe mbështetja e klientit është shumë e shpejtë.",
                "de": "Ausgezeichneter Service! Die Streaming-Qualität ist außergewöhnlich und der Kundensupport reagiert sehr schnell.",
                "en": "Excellent service! The streaming quality is exceptional and customer support is very responsive."
            },
            "rating": 5,
            "image_url": "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8MTc3MDY0NDQ1MHww&ixlib=rb-4.1.0&q=85&w=200",
            "is_active": True,
            "order": 1
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Maria S.",
            "location": "München",
            "text": {
                "sq": "Kam përdorur Izo IPTV për 6 muaj dhe jam shumë i kënaqur. Kanalet punojnë pa probleme dhe VOD ka zgjedhje të madhe.",
                "de": "Ich benutze Izo IPTV seit 6 Monaten und bin sehr zufrieden. Die Kanäle funktionieren problemlos und das VOD hat eine große Auswahl.",
                "en": "I've been using Izo IPTV for 6 months and I'm very satisfied. Channels work flawlessly and VOD has a great selection."
            },
            "rating": 5,
            "image_url": "https://images.unsplash.com/photo-1655249481446-25d575f1c054?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwyfHxwZXJzb24lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8MTc3MDY0NDQ1MHww&ixlib=rb-4.1.0&q=85&w=200",
            "is_active": True,
            "order": 2
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Driton M.",
            "location": "Prishtinë",
            "text": {
                "sq": "Çmimi është shumë i arsyeshëm për cilësinë që ofrohet. Familja ime shikon sport dhe filma çdo ditë pa asnjë problem.",
                "de": "Der Preis ist für die gebotene Qualität sehr angemessen. Meine Familie schaut jeden Tag Sport und Filme ohne Probleme.",
                "en": "The price is very reasonable for the quality offered. My family watches sports and movies every day without any issues."
            },
            "rating": 5,
            "image_url": "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8MTc3MDY0NDQ1MHww&ixlib=rb-4.1.0&q=85&w=200",
            "is_active": True,
            "order": 3
        }
    ]
    await db.testimonials.insert_many(testimonials)
    
    # Seed Contact Info
    contact_info = {
        "id": str(uuid.uuid4()),
        "whatsapp": "+383 49 123 456",
        "telegram": "@izoiptv",
        "email": "info@izoip.tv",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contact_info.insert_one(contact_info)
    
    return {"message": "Data seeded successfully"}

# ============ HEALTH CHECK ============

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
