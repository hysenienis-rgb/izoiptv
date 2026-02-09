#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Izo IPTV
Tests all endpoints and functionality
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

# Use the public endpoint from frontend .env
BASE_URL = "https://izomedia.preview.emergentagent.com/api"

class IPTVAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
    
    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    expected_status: int = 200, auth: bool = False) -> tuple[bool, Dict]:
        """Make HTTP request and validate response"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                return False, {"error": f"Unsupported method: {method}"}
            
            success = response.status_code == expected_status
            try:
                response_data = response.json()
            except:
                response_data = {"status_code": response.status_code, "text": response.text}
            
            return success, response_data
            
        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}
    
    def test_health_check(self):
        """Test health endpoint"""
        success, data = self.make_request('GET', 'health')
        if success and 'status' in data:
            self.log_test("Health Check", True)
            return True
        else:
            self.log_test("Health Check", False, f"Response: {data}")
            return False
    
    def test_admin_setup(self):
        """Test admin setup (should fail if admin exists)"""
        success, data = self.make_request('POST', 'auth/setup', expected_status=400)
        if success:  # 400 means admin already exists, which is expected
            self.log_test("Admin Setup (Already Exists)", True)
            return True
        else:
            # Try to create admin if it doesn't exist
            success, data = self.make_request('POST', 'auth/setup', expected_status=200)
            if success:
                self.log_test("Admin Setup (Created)", True)
                return True
            else:
                self.log_test("Admin Setup", False, f"Response: {data}")
                return False
    
    def test_admin_login(self):
        """Test admin login"""
        login_data = {"username": "admin", "password": "admin123"}
        success, data = self.make_request('POST', 'auth/login', login_data)
        
        if success and 'access_token' in data:
            self.token = data['access_token']
            self.log_test("Admin Login", True)
            return True
        else:
            self.log_test("Admin Login", False, f"Response: {data}")
            return False
    
    def test_admin_me(self):
        """Test get current admin info"""
        success, data = self.make_request('GET', 'auth/me', auth=True)
        if success and 'username' in data:
            self.log_test("Admin Me", True)
            return True
        else:
            self.log_test("Admin Me", False, f"Response: {data}")
            return False
    
    def test_seed_data(self):
        """Test seeding initial data"""
        success, data = self.make_request('POST', 'seed')
        # Should return 200 whether data is seeded or already exists
        if success:
            self.log_test("Seed Data", True)
            return True
        else:
            self.log_test("Seed Data", False, f"Response: {data}")
            return False
    
    def test_packages_crud(self):
        """Test packages CRUD operations"""
        # Get packages
        success, packages = self.make_request('GET', 'packages')
        if not success:
            self.log_test("Get Packages", False, f"Response: {packages}")
            return False
        
        self.log_test("Get Packages", True)
        
        # Verify we have the expected packages
        if len(packages) >= 3:
            basic_found = any(pkg.get('name', {}).get('en') == 'Basic' for pkg in packages)
            standard_found = any(pkg.get('name', {}).get('en') == 'Standard' for pkg in packages)
            premium_found = any(pkg.get('name', {}).get('en') == 'Premium' for pkg in packages)
            
            if basic_found and standard_found and premium_found:
                self.log_test("Package Data Validation", True)
            else:
                self.log_test("Package Data Validation", False, "Missing expected packages")
        else:
            self.log_test("Package Data Validation", False, f"Expected 3+ packages, got {len(packages)}")
        
        # Test creating a new package (requires auth)
        if self.token:
            new_package = {
                "name": {"sq": "Test", "de": "Test", "en": "Test"},
                "price": 5.99,
                "currency": "€",
                "period": {"sq": "muaj", "de": "Monat", "en": "month"},
                "features": {"sq": ["Test feature"], "de": ["Test feature"], "en": ["Test feature"]},
                "is_popular": False,
                "order": 99
            }
            
            success, created_pkg = self.make_request('POST', 'packages', new_package, 200, auth=True)
            if success and 'id' in created_pkg:
                self.log_test("Create Package", True)
                
                # Test updating the package
                updated_data = new_package.copy()
                updated_data['price'] = 7.99
                
                success, updated_pkg = self.make_request('PUT', f"packages/{created_pkg['id']}", 
                                                       updated_data, 200, auth=True)
                if success:
                    self.log_test("Update Package", True)
                else:
                    self.log_test("Update Package", False, f"Response: {updated_pkg}")
                
                # Test deleting the package
                success, _ = self.make_request('DELETE', f"packages/{created_pkg['id']}", 
                                             expected_status=200, auth=True)
                if success:
                    self.log_test("Delete Package", True)
                else:
                    self.log_test("Delete Package", False)
            else:
                self.log_test("Create Package", False, f"Response: {created_pkg}")
        
        return True
    
    def test_faqs_crud(self):
        """Test FAQs CRUD operations"""
        # Get public FAQs
        success, faqs = self.make_request('GET', 'faqs')
        if success:
            self.log_test("Get Public FAQs", True)
        else:
            self.log_test("Get Public FAQs", False, f"Response: {faqs}")
            return False
        
        # Get all FAQs (admin only)
        if self.token:
            success, all_faqs = self.make_request('GET', 'faqs/all', auth=True)
            if success:
                self.log_test("Get All FAQs", True)
            else:
                self.log_test("Get All FAQs", False, f"Response: {all_faqs}")
        
        return True
    
    def test_testimonials_crud(self):
        """Test testimonials CRUD operations"""
        # Get public testimonials
        success, testimonials = self.make_request('GET', 'testimonials')
        if success:
            self.log_test("Get Public Testimonials", True)
        else:
            self.log_test("Get Public Testimonials", False, f"Response: {testimonials}")
            return False
        
        # Get all testimonials (admin only)
        if self.token:
            success, all_testimonials = self.make_request('GET', 'testimonials/all', auth=True)
            if success:
                self.log_test("Get All Testimonials", True)
            else:
                self.log_test("Get All Testimonials", False, f"Response: {all_testimonials}")
        
        return True
    
    def test_contact_functionality(self):
        """Test contact form and messages"""
        # Test contact form submission
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is a test message from the API tester."
        }
        
        success, response = self.make_request('POST', 'contact', contact_data, 200)
        if success and 'id' in response:
            self.log_test("Contact Form Submission", True)
            message_id = response['id']
            
            # Test getting messages (admin only)
            if self.token:
                success, messages = self.make_request('GET', 'contact/messages', auth=True)
                if success:
                    self.log_test("Get Contact Messages", True)
                    
                    # Test marking message as read
                    success, _ = self.make_request('PUT', f'contact/messages/{message_id}/read', 
                                                 expected_status=200, auth=True)
                    if success:
                        self.log_test("Mark Message as Read", True)
                    else:
                        self.log_test("Mark Message as Read", False)
                    
                    # Test deleting message
                    success, _ = self.make_request('DELETE', f'contact/messages/{message_id}', 
                                                 expected_status=200, auth=True)
                    if success:
                        self.log_test("Delete Contact Message", True)
                    else:
                        self.log_test("Delete Contact Message", False)
                else:
                    self.log_test("Get Contact Messages", False, f"Response: {messages}")
        else:
            self.log_test("Contact Form Submission", False, f"Response: {response}")
        
        return True
    
    def test_contact_info(self):
        """Test contact info endpoints"""
        # Get contact info
        success, contact_info = self.make_request('GET', 'contact-info')
        if success:
            self.log_test("Get Contact Info", True)
            
            # Test updating contact info (admin only)
            if self.token:
                updated_info = {
                    "whatsapp": "+383 49 999 888",
                    "telegram": "@testiptv",
                    "email": "test@izoip.tv"
                }
                
                success, _ = self.make_request('PUT', 'contact-info', updated_info, 200, auth=True)
                if success:
                    self.log_test("Update Contact Info", True)
                else:
                    self.log_test("Update Contact Info", False)
        else:
            self.log_test("Get Contact Info", False, f"Response: {contact_info}")
        
        return True
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Izo IPTV Backend API Tests")
        print(f"📡 Testing endpoint: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity
        if not self.test_health_check():
            print("❌ Health check failed - stopping tests")
            return False
        
        # Admin setup and authentication
        self.test_admin_setup()
        if not self.test_admin_login():
            print("❌ Admin login failed - some tests will be skipped")
        else:
            self.test_admin_me()
        
        # Data seeding
        self.test_seed_data()
        
        # CRUD operations
        self.test_packages_crud()
        self.test_faqs_crud()
        self.test_testimonials_crud()
        
        # Contact functionality
        self.test_contact_functionality()
        self.test_contact_info()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False
    
    def get_test_summary(self):
        """Get detailed test summary"""
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": self.tests_run - self.tests_passed,
            "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0,
            "test_results": self.test_results,
            "timestamp": datetime.now().isoformat()
        }

def main():
    """Main test execution"""
    tester = IPTVAPITester()
    
    try:
        success = tester.run_all_tests()
        
        # Save detailed results
        summary = tester.get_test_summary()
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        return 0 if success else 1
        
    except Exception as e:
        print(f"💥 Test execution failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())