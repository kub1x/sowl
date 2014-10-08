#!/bin/bash

#FIREFOX_DIR=/cygdrive/c/Program\ Files\ \(x86\)/Mozilla\ Firefox\ Dev/ ### XXX folder deleted
#FIREFOX_EXE=firerox.exe
#FIREFOX=/cygdrive/c/Program\ Files\ \(x86\)/Mozilla\ Firefox\ Dev/firefox.exe ### XXX folder deleted
FIREFOX=/cygdrive/c/Program\ Files\ \(x86\)/Mozilla\ Firefox/firefox.exe
#FIREFOX_LNK=firefox-dev.exe.lnk
 
# short-name, jar and xpi files name. Must be lowercase with no spaces
APP_NAME=sowl
XPI_NAME=$(APP_NAME).xpi

# which chrome providers we have (space-separated list)
#CHROME_PROVIDERS=content

# ...and these directories       (space separated list)
#ROOT_DIRS=defaults

ROOT_DIR=$(shell pwd)
TMP_DIR=tmp

all: pack install

#clean: 
#	# remove any left-over files from previous build
#	rm -f $(JAR_NAME) $(XPI_NAME)
#	rm -rf $(TMP_DIR)

pack:
	cfx xpi

edit: 
	vim lib

install: 
	#cygstart.exe $(FIREFOX_LNK) "C:\Users\kub1x\school\fel\diplomka\selectowl\ff-extension\$(XPI_NAME)"
	$(FIREFOX) $(XPI_NAME) -P selectowl -no-remote >/dev/null 2>&1 &
	#cp $(APP_NAME).xpi /cygdrive/c/Users/kub1x/AppData/Roaming/Mozilla/Firefox/Profiles/d859hbtr.selectowl/extensions/
	#rm -f /cygdrive/c/Users/kub1x/AppData/Roaming/Mozilla/Firefox/Profiles/d859hbtr.selectowl/extensions.*

run: 
	#cygstart.exe $(FIREFOX_LNK)
	$(FIREFOX) -no-remote -P selectowl >/dev/null 2>&1 &
	#cd $(FIREFOX_DIR) ; $(FIREFOX) -no-remote -P selectowl >/dev/null 2>&1 &

#kill:
#	taskkill.exe /IM firefox.exe && taskkill.exe /IM firefox.exe || echo "no firefox running"

#server:
#	cd testserver ; make run >/dev/null 2>&1 &

