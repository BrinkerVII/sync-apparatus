#!/bin/sh
echo $(find ./src -name '*.scss' -o -name '*.ts' -o -name '*.html' | xargs wc -l | grep total) lines of code
