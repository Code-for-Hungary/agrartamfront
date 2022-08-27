#!/bin/bash

if [ ! -f config.js]; then
  cp config.sample.js config.js
fi