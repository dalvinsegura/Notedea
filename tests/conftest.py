import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import os
from datetime import datetime
import subprocess
import sys
import time

@pytest.fixture(scope="function")
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-web-security")
    chrome_options.add_argument("--allow-running-insecure-content")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    driver = None
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            print(f"Intentando inicializar ChromeDriver (intento {attempt + 1}/{max_retries})...")
            driver = webdriver.Chrome(options=chrome_options)
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            break
            
        except Exception as e:
            print(f"Error al inicializar ChromeDriver: {e}")
            if attempt == max_retries - 1:
                try:
                    subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", "webdriver-manager"], check=True)
                    
                    from webdriver_manager.chrome import ChromeDriverManager
                    
                    driver_path = ChromeDriverManager().install()
                    print(f"ChromeDriver instalado en: {driver_path}")
                    
                    service = Service(driver_path)
                    driver = webdriver.Chrome(service=service, options=chrome_options)
                    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                    break
                    
                except Exception as e2:
                    print(f"Error con webdriver-manager: {e2}")
                    raise Exception(f"No se pudo inicializar ChromeDriver después de {max_retries} intentos: {e2}")
            
            time.sleep(2)
    
    if not driver:
        raise Exception("No se pudo inicializar ChromeDriver")
    
    driver.implicitly_wait(15)
    
    print("✅ ChromeDriver inicializado correctamente")
    
    yield driver
    
    try:
        driver.quit()
        print("✅ ChromeDriver cerrado correctamente")
    except:
        pass

@pytest.fixture
def screenshot_on_failure(request, driver):
    yield
    if request.node.rep_call.failed:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_name = request.node.name
        screenshot_path = f"screenshots/{test_name}_{timestamp}.png"
        os.makedirs("screenshots", exist_ok=True)
        driver.save_screenshot(screenshot_path)
        print(f"Screenshot saved: {screenshot_path}")

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, "rep_" + rep.when, rep)
