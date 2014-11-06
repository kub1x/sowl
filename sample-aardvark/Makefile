#!/bin/bash

FIREFOX=/cygdrive/c/Program\ Files\ \(x86\)/Mozilla\ Firefox/firefox.exe
 
APP_NAME=sample-aardvark
XPI_NAME=$(APP_NAME).xpi

ROOT_DIR=$(shell pwd)
TMP_DIR=tmp

all: pack install

pack:
	cfx xpi

edit: 
	vim lib/main.js

install: 
	$(FIREFOX) $(XPI_NAME) -P selectowl -no-remote >/dev/null 2>&1 &

run: 
	$(FIREFOX) -no-remote -P selectowl >/dev/null 2>&1 &
