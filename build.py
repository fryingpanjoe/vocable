#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Build script
# ------------
# Takes all external css and js-files in one html-file.

import os

INPUT_FILENAME = 'vocable.html'
OUTPUT_FILENAME = 'build/vocable.html'


def find_between(s, first, last):
    try:
        start = s.index(first) + len(first)
        end = s.index(last, start)
        return s[start:end]
    except ValueError:
        return ''


def get_file_content(path):
    with open(path, 'r') as f:
        return f.read()


def js_include(line):
    path = find_between(line, 'src="', '"')
    js = get_file_content(path)
    return '<script type="text/javascript">\n' + js + '\n</script>\n'


def css_include(line):
    path = find_between(line, 'href="', '"')
    css = get_file_content(path)
    return '<style>\n' + css + '\n</style>\n'


def main():
    if not os.path.exists('build'):
        os.makedirs('build')

    with open(OUTPUT_FILENAME, 'w') as out_file:
        with open(INPUT_FILENAME) as in_file:
            for line in in_file:
                if line.strip().startswith('<script src='):
                    out_file.write(js_include(line.strip()))
                elif line.strip().startswith('<link rel="stylesheet"'):
                    out_file.write(css_include(line.strip()))
                else:
                    out_file.write(line)

if __name__ == '__main__':
    main()
