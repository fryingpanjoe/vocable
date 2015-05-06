import os;
INPUT='vocable.html'
OUTPUT='build/vocable.html'

if not os.path.exists('build'):
  os.makedirs('build')

file = open(OUTPUT, "w")

def find_between( s, first, last ):
  try:
    start = s.index( first ) + len( first )
    end = s.index( last, start )
    return s[start:end]
  except ValueError:
    return ""

def get_file_content( path ):
  f = open(path, 'r')
  return f.read()
	
def js_include( line ):
  path = find_between(line, 'src="', '"')
  js = get_file_content(path)
  return '<script type="text/javascript">\n'+js+'\n</script>\n'
  
def css_include( line ):
  path = find_between(line, 'href="', '"')
  css = get_file_content(path)
  return '<style>\n'+css+'\n</style>\n'
  
with open(INPUT) as input_file:
  for line in input_file:
    if line.strip().startswith('<script src='):
      file.write(js_include( line.strip() ))
    elif line.strip().startswith( '<link rel="stylesheet"' ):
      file.write(css_include( line.strip() ))
    else: 
      file.write( line )
	  
	  
