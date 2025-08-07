from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from .base_page import BasePage

class DashboardPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        
        self.new_idea_button = (By.ID, "new-idea-button")
        self.logout_button = (By.ID, "logout-button")
        self.title_input = (By.ID, "note-title-input")
        self.content_area = (By.CSS_SELECTOR, ".min-h-\\[400px\\]")
        self.content_textarea = (By.ID, "note-content-textarea")
        self.enhance_button = (By.ID, "enhance-idea-button")
        self.note_cards = (By.CSS_SELECTOR, "[data-testid^='note-card-']")
        self.delete_buttons = (By.CSS_SELECTOR, "[data-testid^='delete-note-']")
        self.save_indicator = (By.XPATH, "//span[contains(text(), 'Guardado a las')]")
        self.saving_indicator = (By.XPATH, "//span[contains(text(), 'Guardando')]")
        self.enhancement_modal = (By.ID, "enhancement-modal")
        self.accept_enhancement_button = (By.ID, "accept-enhancement-button")
        self.cancel_enhancement_button = (By.ID, "cancel-enhancement-button")
    
    def click_new_idea(self):
        new_idea_btn = self.wait_for_clickable(self.new_idea_button)
        new_idea_btn.click()
    
    def fill_title(self, title):
        title_element = self.wait_for_element(self.title_input)
        
        # Asegurar que el elemento esté enfocado
        self.driver.execute_script("arguments[0].focus();", title_element)
        
        # Limpiar contenido existente
        title_element.clear()
        
        # Usar JavaScript para establecer el valor y disparar eventos
        self.driver.execute_script("""
            const element = arguments[0];
            const value = arguments[1];
            
            // Establecer valor
            element.value = value;
            
            // Disparar eventos de React
            const inputEvent = new Event('input', { 
                bubbles: true, 
                cancelable: true 
            });
            const changeEvent = new Event('change', { 
                bubbles: true, 
                cancelable: true 
            });
            
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(changeEvent);
        """, title_element, title)
        
        # Verificar que el título se estableció
        import time
        time.sleep(0.5)
        
        actual_value = title_element.get_attribute("value")
        if title not in actual_value:
            # Si no funcionó, intentar de nuevo con send_keys
            title_element.clear()
            title_element.send_keys(title)
    
    def fill_content(self, content):
        """Rellena el contenido del textarea simulando tipeo de usuario real"""
        # Activar modo edición
        content_area_element = self.wait_for_element(self.content_area)
        content_area_element.click()
        
        # Esperar a que aparezca el textarea
        content_element = self.wait_for_element(self.content_textarea)
        
        # Enfocar y limpiar
        self.driver.execute_script("arguments[0].focus();", content_element)
        content_element.clear()
        
        # Simular entrada de texto con eventos React específicos
        script = """
        const textarea = arguments[0];
        const text = arguments[1];
        
        // Enfocar el textarea y limpiar
        textarea.focus();
        textarea.value = '';
        
        // Establecer el valor completo
        textarea.value = text;
        
        // Actualizar posición del cursor
        textarea.selectionStart = text.length;
        textarea.selectionEnd = text.length;
        
        // Crear evento change que React escucha específicamente
        // React usa SyntheticEvent que envuelve eventos nativos
        const nativeEvent = new Event('change', {
            bubbles: true,
            cancelable: true,
            composed: true
        });
        
        // Simular la estructura que React espera
        const syntheticEvent = {
            target: textarea,
            currentTarget: textarea,
            type: 'change',
            bubbles: true,
            cancelable: true,
            nativeEvent: nativeEvent,
            persist: function() {},
            preventDefault: function() { nativeEvent.preventDefault(); },
            stopPropagation: function() { nativeEvent.stopPropagation(); }
        };
        
        // Disparar evento nativo primero
        textarea.dispatchEvent(nativeEvent);
        
        // También disparar evento input para completar la simulación
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
            composed: true
        });
        textarea.dispatchEvent(inputEvent);
        
        // Forzar actualización del estado si el textarea tiene _valueTracker
        if (textarea._valueTracker) {
            textarea._valueTracker.setValue('');
        }
        
        // Dispatch del evento change otra vez para asegurar que React lo detecte
        const finalEvent = new Event('change', { bubbles: true });
        Object.defineProperty(finalEvent, 'target', { value: textarea });
        textarea.dispatchEvent(finalEvent);
        
        console.log('✅ Eventos React disparados. Valor final:', textarea.value);
        return textarea.value;
        """
        
        result = self.driver.execute_script(script, content_element, content)
        
        # Dar tiempo para que React procese todos los eventos
        import time
        time.sleep(1)
        
        # Verificar que el contenido se estableció correctamente
        actual_value = content_element.get_attribute("value")
        print(f"📝 Contenido establecido: '{actual_value}'")
        
        if actual_value != content:
            print(f"⚠️ Fallback: usando send_keys como respaldo")
            content_element.clear()
            content_element.send_keys(content)
            time.sleep(0.5)
    
    def wait_for_auto_save(self, timeout=20):
        try:
            # Primero verificar si está guardando
            print("🔄 Esperando a que comience el guardado...")
            self.wait_for_element(self.saving_indicator, timeout=5)
            print("✅ Proceso de guardado iniciado")
            
            # Luego esperar a que termine y muestre el indicador de guardado
            self.wait_for_element(self.save_indicator, timeout)
            print("✅ Nota guardada exitosamente")
            return True
        except TimeoutException:
            print("⚠️ Timeout esperando auto-save, verificando estado...")
            # Verificar si ya está guardado (puede haber sido muy rápido)
            try:
                self.driver.find_element(*self.save_indicator)
                print("✅ Nota ya estaba guardada")
                return True
            except:
                print("❌ No se pudo confirmar el guardado")
                return False
    
    def get_note_cards(self):
        try:
            return self.driver.find_elements(*self.note_cards)
        except NoSuchElementException:
            return []
    
    def click_note_card(self, index=0):
        note_cards = self.get_note_cards()
        if len(note_cards) > index:
            note_cards[index].click()
    
    def delete_note(self, index=0):
        delete_buttons = self.driver.find_elements(*self.delete_buttons)
        if len(delete_buttons) > index:
            delete_buttons[index].click()
            
            self.wait.until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert.accept()
    
    def cancel_delete_note(self, index=0):
        delete_buttons = self.driver.find_elements(*self.delete_buttons)
        if len(delete_buttons) > index:
            delete_buttons[index].click()
            
            self.wait.until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert.dismiss()
    
    def click_enhance_idea(self):
        enhance_btn = self.wait_for_clickable(self.enhance_button)
        enhance_btn.click()
    
    def is_enhance_button_available(self):
        try:
            self.driver.find_element(*self.enhance_button)
            return True
        except NoSuchElementException:
            return False
    
    def wait_for_enhancement_modal(self, timeout=15):
        try:
            self.wait_for_element(self.enhancement_modal, timeout)
            return True
        except TimeoutException:
            return False
    
    def accept_enhancement(self):
        accept_btn = self.wait_for_clickable(self.accept_enhancement_button)
        accept_btn.click()
    
    def cancel_enhancement(self):
        cancel_btn = self.wait_for_clickable(self.cancel_enhancement_button)
        cancel_btn.click()
    
    def logout(self):
        logout_btn = self.wait_for_clickable(self.logout_button)
        logout_btn.click()
    
    def get_title_value(self):
        title_element = self.wait_for_element(self.title_input)
        return title_element.get_attribute("value")
    
    def get_content_value(self):
        content_element = self.wait_for_element(self.content_textarea)
        return content_element.get_attribute("value")
