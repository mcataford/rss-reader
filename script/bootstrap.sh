#!/bin/bash

if [[ -z "${CI+true}" ]]; then
    nvm use
fi

corepack enable && yarn
