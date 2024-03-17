
################################################################################
# Python script that logins successfully to www.zamunda.net and execute Search
################################################################################

import re
import requests

class zamunda():
    def __init__(self,base_url,user,password):
        
        self.user = user
        self.password = password
        self.session = requests.Session()
        self.base_url = base_url

        self.__HEADERS = {
            'User-Agent' : 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:32.0) Gecko/20100101 Firefox/32.0'
            }
        
        self.login()

    
    def login(self):

        response = self.session.post('%s/takelogin.php' % self.base_url, data={'username' : self.user, 'password' : self.password}, headers = self.__HEADERS)

        if response.status_code == requests.codes.ok and re.search(self.user, response.text, re.IGNORECASE): #If username is found in response.text Login was sucessful
            # print(response.text)

            print('Login Succesful')
            self._use_log = True
            return True
        else:
            print('Login Error')
            raise Exception("LoginFail")
        
        
zamunda_instance = zamunda(base_url="https://zamunda.net", user="coyec75395", password="rxM6N.h2N4aYe7_")