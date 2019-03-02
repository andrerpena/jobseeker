#!/usr/bin/env bash
ssh root@157.230.209.56 'cd /root/git/jobseeker; git pull; npm run build; npm run start'