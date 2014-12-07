#!/bin/bash

FIREFOX=/cygdrive/c/Program\ Files\ \(x86\)/Mozilla\ Firefox/firefox.exe
 
# short-name, jar and xpi files name. Must be lowercase with no spaces
APP_NAME=sowl
XPI_NAME=$(APP_NAME).xpi

all: pack install

pack:
	cfx xpi

edit: 
	vim data/sidebar/sidebar.js

install: 
	$(FIREFOX) $(XPI_NAME) -P selectowl -no-remote >/dev/null 2>&1 &

run: 
	$(FIREFOX) -no-remote -P selectowl >/dev/null 2>&1 &
