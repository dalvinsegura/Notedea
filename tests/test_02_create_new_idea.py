import pytest
from tests.pages.login_page import LoginPage
from tests.pages.dashboard_page import DashboardPage
from tests.utils.test_data import TestDataGenerator

class TestCreateNewIdea:
    
    def setup_method(self):
        self.test_email = TestDataGenerator.generate_email()
        self.test_password = TestDataGenerator.generate_password()
    
    def authenticate_user(self, driver):
        login_page = LoginPage(driver)
        login_page.navigate_to_login()
        login_page.toggle_to_signup()
        login_page.fill_email(self.test_email)
        login_page.fill_password(self.test_password)
        login_page.click_submit()
        login_page.wait_for_redirect_to_dashboard()
    
    def test_happy_path_create_new_idea(self, driver):
        self.authenticate_user(driver)
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.take_screenshot("create_happy_01_dashboard")
        
        dashboard_page.click_new_idea()
        dashboard_page.take_screenshot("create_happy_02_editor_opened")
        
        test_title = TestDataGenerator.generate_note_title()
        test_content = TestDataGenerator.generate_note_content()
        
        dashboard_page.fill_title(test_title)
        dashboard_page.take_screenshot("create_happy_03_title_filled")
        
        dashboard_page.fill_content(test_content)
        dashboard_page.take_screenshot("create_happy_04_content_filled")
        
        save_success = dashboard_page.wait_for_auto_save()
        dashboard_page.take_screenshot("create_happy_05_auto_saved")
        
        assert save_success
        
        note_cards = dashboard_page.get_note_cards()
        assert len(note_cards) > 0
    
    def test_negative_create_without_authentication(self, driver):
        dashboard_page = DashboardPage(driver)
        dashboard_page.navigate_to("/notes")
        dashboard_page.take_screenshot("create_negative_01_no_auth_redirect")
        
        current_url = dashboard_page.get_current_url()
        assert "/notes" not in current_url
    
    def test_boundary_minimal_content(self, driver):
        self.authenticate_user(driver)
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.click_new_idea()
        dashboard_page.take_screenshot("create_boundary_01_new_editor")
        
        dashboard_page.fill_title("T")
        dashboard_page.fill_content("C")
        dashboard_page.take_screenshot("create_boundary_02_minimal_content")
        
        save_success = dashboard_page.wait_for_auto_save()
        dashboard_page.take_screenshot("create_boundary_03_minimal_saved")
        
        assert save_success
        
        note_cards = dashboard_page.get_note_cards()
        assert len(note_cards) > 0
    
    def test_boundary_empty_title_with_content(self, driver):
        self.authenticate_user(driver)
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.click_new_idea()
        dashboard_page.take_screenshot("create_boundary_empty_title_01_new_editor")
        
        dashboard_page.fill_title("")
        dashboard_page.fill_content(TestDataGenerator.generate_note_content())
        dashboard_page.take_screenshot("create_boundary_empty_title_02_content_only")
        
        save_success = dashboard_page.wait_for_auto_save()
        dashboard_page.take_screenshot("create_boundary_empty_title_03_saved")
        
        assert save_success
        
        note_cards = dashboard_page.get_note_cards()
        assert len(note_cards) > 0
