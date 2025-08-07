import pytest
from tests.pages.login_page import LoginPage
from tests.pages.dashboard_page import DashboardPage
from tests.utils.test_data import TestDataGenerator

class TestEnhanceIdeaWithAI:
    
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
    
    def test_happy_path_enhance_idea_with_sufficient_content(self, driver):
        self.authenticate_user(driver)
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.click_new_idea()
        dashboard_page.take_screenshot("enhance_happy_01_new_editor")
        
        title = "Idea para mejorar"
        content = TestDataGenerator.generate_note_content(100)
        
        dashboard_page.fill_title(title)
        dashboard_page.fill_content(content)
        dashboard_page.take_screenshot("enhance_happy_02_content_filled")
        
        dashboard_page.wait_for_auto_save()
        dashboard_page.take_screenshot("enhance_happy_03_saved")
        
        assert dashboard_page.is_enhance_button_available()
        
        dashboard_page.click_enhance_idea()
        dashboard_page.take_screenshot("enhance_happy_04_enhancement_clicked")
        
        modal_appeared = dashboard_page.wait_for_enhancement_modal()
        dashboard_page.take_screenshot("enhance_happy_05_modal_opened")
        
        if modal_appeared:
            dashboard_page.accept_enhancement()
            dashboard_page.take_screenshot("enhance_happy_06_enhancement_accepted")
            dashboard_page.wait_for_auto_save()
    
    def test_negative_insufficient_content_no_enhance_button(self, driver):
        self.authenticate_user(driver)
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.click_new_idea()
        dashboard_page.take_screenshot("enhance_negative_01_new_editor")
        
        dashboard_page.fill_title("Corto")
        dashboard_page.fill_content(TestDataGenerator.generate_short_content())
        dashboard_page.take_screenshot("enhance_negative_02_insufficient_content")
        
        dashboard_page.wait_for_auto_save()
        dashboard_page.take_screenshot("enhance_negative_03_button_check")
        
        assert not dashboard_page.is_enhance_button_available()
    
    def test_negative_enhance_without_authentication(self, driver):
        dashboard_page = DashboardPage(driver)
        dashboard_page.navigate_to("/notes")
        dashboard_page.take_screenshot("enhance_negative_auth_01_no_access")
        
        current_url = dashboard_page.get_current_url()
        assert "/notes" not in current_url
    
    def test_boundary_reject_enhancement(self, driver):
        self.authenticate_user(driver)
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.click_new_idea()
        
        original_title = "Idea original"
        original_content = TestDataGenerator.generate_note_content(100)
        
        dashboard_page.fill_title(original_title)
        dashboard_page.fill_content(original_content)
        dashboard_page.wait_for_auto_save()
        dashboard_page.take_screenshot("enhance_boundary_01_original_content")
        
        if dashboard_page.is_enhance_button_available():
            dashboard_page.click_enhance_idea()
            modal_appeared = dashboard_page.wait_for_enhancement_modal()
            dashboard_page.take_screenshot("enhance_boundary_02_modal_opened")
            
            if modal_appeared:
                dashboard_page.cancel_enhancement()
                dashboard_page.take_screenshot("enhance_boundary_03_enhancement_rejected")
                
                current_title = dashboard_page.get_title_value()
                current_content = dashboard_page.get_content_value()
                
                assert current_title == original_title
                assert current_content == original_content
    
    def test_boundary_empty_content_no_enhancement(self, driver):
        self.authenticate_user(driver)
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.click_new_idea()
        dashboard_page.take_screenshot("enhance_boundary_empty_01_new_editor")
        
        dashboard_page.fill_title("Solo título")
        dashboard_page.fill_content("")
        dashboard_page.take_screenshot("enhance_boundary_empty_02_no_content")
        
        dashboard_page.wait_for_auto_save()
        
        assert not dashboard_page.is_enhance_button_available()
    
    def test_boundary_minimum_content_threshold(self, driver):
        self.authenticate_user(driver)
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.click_new_idea()
        dashboard_page.take_screenshot("enhance_boundary_threshold_01_new_editor")
        
        min_content = "a" * 10
        dashboard_page.fill_title("Contenido mínimo")
        dashboard_page.fill_content(min_content)
        dashboard_page.take_screenshot("enhance_boundary_threshold_02_min_content")
        
        dashboard_page.wait_for_auto_save()
        
        button_available = dashboard_page.is_enhance_button_available()
        dashboard_page.take_screenshot("enhance_boundary_threshold_03_button_check")
        
        assert button_available
