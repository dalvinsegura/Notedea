import pytest
from tests.pages.login_page import LoginPage
from tests.pages.dashboard_page import DashboardPage
from tests.utils.test_data import TestDataGenerator

class TestUserAuthentication:
    
    def setup_method(self):
        self.test_email = TestDataGenerator.generate_email()
        self.test_password = TestDataGenerator.generate_password()
    
    def test_happy_path_user_registration_and_login(self, driver):
        login_page = LoginPage(driver)
        dashboard_page = DashboardPage(driver)
        
        login_page.navigate_to_login()
        login_page.take_screenshot("auth_happy_01_login_page")
        
        login_page.toggle_to_signup()
        login_page.take_screenshot("auth_happy_02_signup_form")
        assert login_page.is_signup_form()
        
        login_page.fill_email(self.test_email)
        login_page.fill_password(self.test_password)
        login_page.take_screenshot("auth_happy_03_form_filled")
        
        login_page.click_submit()
        login_page.take_screenshot("auth_happy_04_form_submitted")
        
        login_page.wait_for_redirect_to_dashboard()
        login_page.take_screenshot("auth_happy_05_dashboard_loaded")
        
        assert "/notes" in login_page.get_current_url()
    
    def test_negative_invalid_credentials(self, driver):
        login_page = LoginPage(driver)
        
        login_page.navigate_to_login()
        login_page.take_screenshot("auth_negative_01_login_page")
        
        login_page.fill_email("wrong@example.com")
        login_page.fill_password("wrongpassword")
        login_page.take_screenshot("auth_negative_02_wrong_credentials")
        
        login_page.click_submit()
        login_page.take_screenshot("auth_negative_03_form_submitted")
        
        error_message = login_page.get_error_message()
        login_page.take_screenshot("auth_negative_04_error_shown")
        
        assert error_message is not None
        assert "/notes" not in login_page.get_current_url()
    
    def test_boundary_invalid_email_format(self, driver):
        login_page = LoginPage(driver)
        
        login_page.navigate_to_login()
        login_page.toggle_to_signup()
        login_page.take_screenshot("auth_boundary_01_signup_form")
        
        invalid_email = TestDataGenerator.get_invalid_emails()[0]
        login_page.fill_email(invalid_email)
        login_page.fill_password("validpassword123")
        login_page.take_screenshot("auth_boundary_02_invalid_email")
        
        login_page.click_submit()
        login_page.take_screenshot("auth_boundary_03_validation_error")
        
        email_input = driver.find_element(*login_page.email_input)
        validation_message = email_input.get_attribute("validationMessage")
        
        assert validation_message != ""
        assert "/notes" not in login_page.get_current_url()
    
    def test_boundary_weak_password(self, driver):
        login_page = LoginPage(driver)
        
        login_page.navigate_to_login()
        login_page.toggle_to_signup()
        login_page.take_screenshot("auth_boundary_weak_01_signup_form")
        
        weak_password = TestDataGenerator.get_weak_passwords()[0]
        login_page.fill_email(self.test_email)
        login_page.fill_password(weak_password)
        login_page.take_screenshot("auth_boundary_weak_02_weak_password")
        
        login_page.click_submit()
        login_page.take_screenshot("auth_boundary_weak_03_validation_error")
        
        password_input = driver.find_element(*login_page.password_input)
        validation_message = password_input.get_attribute("validationMessage")
        
        assert validation_message != "" or login_page.get_error_message() is not None
