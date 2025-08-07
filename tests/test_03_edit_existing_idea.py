import pytest
from tests.pages.login_page import LoginPage
from tests.pages.dashboard_page import DashboardPage
from tests.utils.test_data import TestDataGenerator

class TestEditExistingIdea:
    
    def setup_method(self):
        self.test_email = TestDataGenerator.generate_email()
        self.test_password = TestDataGenerator.generate_password()
    
    def authenticate_and_create_note(self, driver):
        login_page = LoginPage(driver)
        login_page.navigate_to_login()
        login_page.toggle_to_signup()
        login_page.fill_email(self.test_email)
        login_page.fill_password(self.test_password)
        login_page.click_submit()
        login_page.wait_for_redirect_to_dashboard()
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.click_new_idea()
        dashboard_page.fill_title("Nota inicial para editar")
        dashboard_page.fill_content("Contenido inicial que será modificado.")
        dashboard_page.wait_for_auto_save()
        return dashboard_page
    
    def test_happy_path_edit_existing_idea(self, driver):
        dashboard_page = self.authenticate_and_create_note(driver)
        dashboard_page.take_screenshot("edit_happy_01_note_created")
        
        dashboard_page.click_note_card(0)
        dashboard_page.take_screenshot("edit_happy_02_note_opened")
        
        new_title = "Título editado"
        new_content = "Contenido completamente nuevo y mejorado con más detalles."
        
        dashboard_page.fill_title(new_title)
        dashboard_page.take_screenshot("edit_happy_03_title_edited")
        
        dashboard_page.fill_content(new_content)
        dashboard_page.take_screenshot("edit_happy_04_content_edited")
        
        save_success = dashboard_page.wait_for_auto_save()
        dashboard_page.take_screenshot("edit_happy_05_changes_saved")
        
        assert save_success
        
        saved_title = dashboard_page.get_title_value()
        saved_content = dashboard_page.get_content_value()
        
        assert saved_title == new_title
        assert saved_content == new_content
    
    def test_negative_edit_without_authentication(self, driver):
        dashboard_page = DashboardPage(driver)
        dashboard_page.navigate_to("/notes/some-note-id")
        dashboard_page.take_screenshot("edit_negative_01_no_auth_redirect")
        
        current_url = dashboard_page.get_current_url()
        assert "/notes" not in current_url
    
    def test_boundary_edit_nonexistent_note(self, driver):
        login_page = LoginPage(driver)
        login_page.navigate_to_login()
        login_page.toggle_to_signup()
        login_page.fill_email(self.test_email)
        login_page.fill_password(self.test_password)
        login_page.click_submit()
        login_page.wait_for_redirect_to_dashboard()
        
        dashboard_page = DashboardPage(driver)
        dashboard_page.navigate_to("/notes/nonexistent-note-123")
        dashboard_page.take_screenshot("edit_boundary_01_nonexistent_note")
        
        current_url = dashboard_page.get_current_url()
        
        assert "/notes" in current_url and "nonexistent-note-123" not in current_url
    
    def test_boundary_clear_all_content(self, driver):
        dashboard_page = self.authenticate_and_create_note(driver)
        dashboard_page.click_note_card(0)
        dashboard_page.take_screenshot("edit_boundary_clear_01_note_opened")
        
        dashboard_page.fill_title("")
        dashboard_page.fill_content("")
        dashboard_page.take_screenshot("edit_boundary_clear_02_content_cleared")
        
        save_success = dashboard_page.wait_for_auto_save()
        dashboard_page.take_screenshot("edit_boundary_clear_03_saved")
        
        assert save_success
        
        saved_title = dashboard_page.get_title_value()
        saved_content = dashboard_page.get_content_value()
        
        assert saved_title == ""
        assert saved_content == ""
