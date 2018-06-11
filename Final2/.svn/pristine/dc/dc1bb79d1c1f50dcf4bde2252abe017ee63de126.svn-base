# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class Login(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:5000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_login(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        try: self.assertEqual("iClicker++", driver.title)
        except AssertionError as e: self.verificationErrors.append(str(e))
        driver.find_element_by_id("login-toggle-button").click()
        driver.find_element_by_xpath("//button[@type='submit']").click()
        self.assertEqual("Empty field!", self.close_alert_and_get_its_text())
        driver.find_element_by_id("create-toggle-button").click()
        driver.find_element_by_xpath("//button[@type='submit']").click()
        self.assertEqual("Empty field!", self.close_alert_and_get_its_text())
        driver.find_element_by_id("inputNameCreate").clear()
        driver.find_element_by_id("inputNameCreate").send_keys("name")
        driver.find_element_by_id("inputNetIDCreate").clear()
        driver.find_element_by_id("inputNetIDCreate").send_keys("netID")
        driver.find_element_by_id("inputEmailCreate").clear()
        driver.find_element_by_id("inputEmailCreate").send_keys("email")
        driver.find_element_by_id("inputPasswordCreate").clear()
        driver.find_element_by_id("inputPasswordCreate").send_keys("1")
        driver.find_element_by_id("inputConfirmPasswordCreate").clear()
        driver.find_element_by_id("inputConfirmPasswordCreate").send_keys("1")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        self.assertEqual("Invalid email field", self.close_alert_and_get_its_text())
        driver.find_element_by_id("inputEmailCreate").clear()
        driver.find_element_by_id("inputEmailCreate").send_keys("email@email")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        self.assertEqual("Success!", self.close_alert_and_get_its_text())
        Select(driver.find_element_by_id("inputStatusCreate")).select_by_visible_text("Teacher")
        driver.find_element_by_id("inputNameCreate").clear()
        driver.find_element_by_id("inputNameCreate").send_keys("teacher")
        driver.find_element_by_id("inputNetIDCreate").clear()
        driver.find_element_by_id("inputNetIDCreate").send_keys("teacherID")
        driver.find_element_by_id("inputEmailCreate").clear()
        driver.find_element_by_id("inputEmailCreate").send_keys("teacher@teachermail")
        driver.find_element_by_id("inputPasswordCreate").clear()
        driver.find_element_by_id("inputPasswordCreate").send_keys("1")
        driver.find_element_by_id("inputConfirmPasswordCreate").clear()
        driver.find_element_by_id("inputConfirmPasswordCreate").send_keys("1")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        self.assertEqual("Success!", self.close_alert_and_get_its_text())
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
