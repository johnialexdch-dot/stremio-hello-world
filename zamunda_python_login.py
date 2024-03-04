# -*- coding: utf-8 -*-
import re
import requests
import os

class zamunda():
    def __init__(
                self,
                base_url,
                usr,
                passwd,
                ):
        
        self.__usr = usr
        self.__pass = passwd
        self.__s = requests.Session()
        self.__base_url = base_url


        self.__HEADERS = {
            'Host' : self.__base_url.split('//')[1],
            'User-Agent' : 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:32.0) Gecko/20100101 Firefox/32.0'
            }
        
        self.__do_login()

    
    def __do_login(self):

        r = self.__s.post('%s/takelogin.php' % self.__base_url, data={'username' : self.__usr, 'password' : self.__pass}, headers = self.__HEADERS)

        if r.status_code == requests.codes.ok and re.search(self.__usr, r.text, re.IGNORECASE):
            print(r.text)
            # self.writeToFile(msg=r.text)

            print('Login OK')
            self._use_log = True
            return True
        else:
            print('Login Error')
            raise Exception("LoginFail")
        

    def writeToFile(self, msg):
        filename = 'test_py.html'
        file_path = os.path.join(os.getcwd(), "TEST", filename)

        with open(file_path, "w") as f:
            f.write(msg)
        

zamunda_instance = zamunda(base_url="https://zamunda.net", usr="coyec75395", passwd="rxM6N.h2N4aYe7_")