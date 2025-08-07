import pytest
from tests.pages.login_page import LoginPage
from tests.pages.dashboard_page import DashboardPage
from tests.utils.test_data import TestDataGenerator

class TestDeleteIdea:
    
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
        dashboard_page.fill_title("Nota para eliminar")
        dashboard_page.fill_content("Esta nota será eliminada en las pruebas.")
        dashboard_page.wait_for_auto_save()
        return dashboard_page
    
    def test_happy_path_delete_idea_with_confirmation(self, driver):
        dashboard_page = self.authenticate_and_create_note(driver)
        
        notes_before = dashboard_page.get_note_cards()
        initial_count = len(notes_before)
        dashboard_page.take_screenshot("delete_happy_01_before_delete")
        
        dashboard_page.delete_note(0)
        dashboard_page.take_screenshot("delete_happy_02_after_delete")
        
        notes_after = dashboard_page.get_note_cards()
        final_count = len(notes_after)
        
        assert final_count == initial_count - 1
    
    def test_negative_cancel_delete_confirmation(self, driver):
        dashboard_page = self.authenticate_and_create_note(driver)
        
        notes_before = dashboard_page.get_note_cards()
        initial_count = len(notes_before)
        dashboard_page.take_screenshot("delete_negative_01_before_cancel")
        
        dashboard_page.cancel_delete_note(0)
        dashboard_page.take_screenshot("delete_negative_02_after_cancel")
        
        notes_after = dashboard_page.get_note_cards()
        final_count = len(notes_after)
        
        assert final_count == initial_count
    
    def test_negative_delete_without_authentication(self, driver):
        dashboard_page = DashboardPage(driver)
        dashboard_page.navigate_to("/notes")
        dashboard_page.take_screenshot("delete_negative_auth_01_no_access")
        
        current_url = dashboard_page.get_current_url()
        assert "/notes" not in current_url
    
    def test_boundary_delete_last_remaining_note(self, driver):
        dashboard_page = self.authenticate_and_create_note(driver)
        
        notes_before = dashboard_page.get_note_cards()
        dashboard_page.take_screenshot("delete_boundary_01_single_note")
        
        dashboard_page.delete_note(0)
        dashboard_page.take_screenshot("delete_boundary_02_after_delete")
        
        notes_after = dashboard_page.get_note_cards()
        assert len(notes_after) == 0
    
    def test_boundary_multiple_notes_delete_sequence(self, driver):
        login_page = LoginPage(driver)
        login_page.navigate_to_login()
        login_page.toggle_to_signup()
        login_page.fill_email(self.test_email)
        login_page.fill_password(self.test_password)
        login_page.click_submit()
        login_page.wait_for_redirect_to_dashboard()
        
        dashboard_page = DashboardPage(driver)
        
        for i in range(3):
            dashboard_page.click_new_idea()
            dashboard_page.fill_title(f"Nota {i+1}")
            dashboard_page.fill_content(f"Contenido de la nota {i+1}")
            dashboard_page.wait_for_auto_save()
        
        dashboard_page.take_screenshot("delete_boundary_multiple_01_three_notes")
        
        initial_count = len(dashboard_page.get_note_cards())
        
        dashboard_page.delete_note(0)
        dashboard_page.take_screenshot("delete_boundary_multiple_02_one_deleted")
        
        dashboard_page.delete_note(0)
        dashboard_page.take_screenshot("delete_boundary_multiple_03_two_deleted")
        
        final_count = len(dashboard_page.get_note_cards())
        assert final_count == initial_count - 2
