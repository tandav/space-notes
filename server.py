from flask import Flask, request, jsonify, Response, abort, send_file
from time import time
from binascii import b2a_hex
import os
import shutil
from helpers import *


SPACES_DIR = '/Users/tandav/Documents/108/spaces'

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    return response


@app.route('/space/<space>', methods=['GET'])
def get_space_notes_and_files(space):
    
    space_dir = f'{SPACES_DIR}/{space}'
    
    if os.path.isdir(space_dir):
        
        if space == 'all':
            update_spaces_stats(SPACES_DIR)
        
        return jsonify({
            'notes': get_notes(space_dir),
            'files': get_files(space_dir),
        })
    else:
        abort(404)



@app.route('/<space>/note', methods=['POST'])
def create_note(space):
    # create new note in given space, return all notes in space
    hash = b2a_hex(os.urandom(8)).decode('utf-8')
    new_html = f'{SPACES_DIR}/{space}/{hash}.html'
    open(new_html, 'x').close() # x mode: if file exist, raise an error

    edited_html_string = edit_in_text_editor(new_html)
    
    return jsonify({
        'hash': hash,  
        'html': edited_html_string,
    })




@app.route('/<space>/<note>', methods=['PATCH'])
def edit_note(space, note):

    edited_html_string = edit_in_text_editor(f'{SPACES_DIR}/{space}/{note}.html')

    return Response(edited_html_string, mimetype='text/xml')


@app.route('/<space>/<note_hash>', methods=['DELETE'])
def delete_note(space, note_hash):
    os.remove(f'{SPACES_DIR}/{space}/{note_hash}.html')

    print(os.path.exists(f'{SPACES_DIR}/{space}/images'))

    if os.path.exists(f'{SPACES_DIR}/{space}/images'):
        images = [x for x in os.listdir(f'{SPACES_DIR}/{space}/images') if x != '.DS_Store']
    else:
        images = []

    if len(images) == 1:
        shutil.rmtree(f'{SPACES_DIR}/{space}/images')
    else:
        for image in images:
            if note_hash == os.path.splitext(image)[0]:
                os.remove(f'{SPACES_DIR}/{space}/images/{image}')
                break

    return Response(None, 200)

@app.route('/<space_name>', methods=['POST'])
def new_space(space_name):
    # hash = b2a_hex(os.urandom(8)).decode('utf-8')
    # os.mkdir(f'{SPACES_DIR}/{hash}')
    os.mkdir(f'{SPACES_DIR}/{space_name}')
    # return Response(hash, 200, mimetype='text/xml')
    return Response(None, 200)

@app.route('/space/<space>', methods=['DELETE'])
def delete_space(space):
    shutil.rmtree(f'{SPACES_DIR}/{space}')
    return Response(None, 200)


@app.route('/space/<space>/<new_space_name>', methods=['POST'])
def new_link_note(space, new_space_name):
    link_note_hash  = b2a_hex(os.urandom(8)).decode('utf-8')

    link_note_html = f'<a href=\'{new_space_name}\'><h1>{new_space_name}</h1></a>\n'
    with open(f'{SPACES_DIR}/{space}/{link_note_hash}.html', 'x') as link_note:
        link_note.write(link_note_html)

    os.mkdir(f'{SPACES_DIR}/{new_space_name}')

    return jsonify({
        'hash': link_note_hash,  
        'html': link_note_html,
    })

@app.route('/eval', methods=['POST'])
def eval():
    script = request.get_json()['script']

    if request.remote_addr == '127.0.0.1':
        os.system(script)
        return Response(None, 200)
    else:
        log.write(str(403) + '\n')
        abort(403)

@app.route('/space/<space>/eval', methods=['POST'])
def eval_from_space(space):
    script = request.get_json()['script']

    if request.remote_addr == '127.0.0.1':
        os.chdir(f'{SPACES_DIR}/{space}')
        os.system(script)
        return Response(None, 200)
    else:
        log.write(str(403) + '\n')
        abort(403)

@app.route('/space/<space>/finder', methods=['GET'])
def open_space_in_finder(space):
    os.system(f'open {SPACES_DIR}/{space}')
    return Response(None, 200)
    
@app.route('/space/<space>/terminal', methods=['GET'])
def open_space_in_terminal(space):
    os.system(f'open -a Terminal {SPACES_DIR}/{space}')
    return Response(None, 200)

@app.route('/space/<space>/eval/<script>', methods=['GET'])
def eval_space_script(space, script):
    os.system(f'bash {SPACES_DIR}/{space}/{script}.sh')
    return Response(None, 200)

@app.route('/space/<space>/<note>/upload_image', methods=['POST'])
def upload_file(space, note):
    file = request.files['file']
    
    filename = note + os.path.splitext(file.filename)[1]

    if not os.path.exists(f'{SPACES_DIR}/{space}/images'):
        os.mkdir(f'{SPACES_DIR}/{space}/images')

    file.save(f'{SPACES_DIR}/{space}/images/{filename}')
    return Response(None, 200)

@app.route('/space/<space>/<image>')
def get_image(space, image):
    return send_file(f'{SPACES_DIR}/{space}/images/{image}')
