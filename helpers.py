import os
import subprocess
from glob import glob


def get_notes(space_dir):
    notes = [x for x in os.listdir(f'{space_dir}/notes') if x != '.DS_Store']
    notes_sorted = sorted(
        notes,
        key=lambda x: os.path.getmtime(f'{space_dir}/notes/{x}/{x}.html')
    )
    notes_json = []

    for note in notes_sorted:
        
        note_item = {'hash': note}
        
        with open(f'{space_dir}/notes/{note}/{note}.html') as note_html:
            note_item['html'] =  note_html.read()


        png  = f'{space_dir}/notes/{note}/{note}.png'
        jpg  = f'{space_dir}/notes/{note}/{note}.jpg'
        jpeg = f'{space_dir}/notes/{note}/{note}.jpeg'

        for ext in (png, jpg, jpeg):
            if os.path.exists(ext):
                note_item['image'] = os.path.basename(ext)
                break
        notes_json.append(note_item)

    return notes_json


def get_files(dir):

    items   = []
    files   = []
    folders = []

    for item in os.listdir(dir):
        if item != '.DS_Store':
            if os.path.isfile(f'{dir}/{item}'):
                files.append({ 'name' : item, 'type' : 'file' })
            else:
                folders.append({ 'name' : item, 'type' : 'folder' })

    items.extend(folders)
    items.extend(files)

    return items

def edit_in_text_editor(file):
    editor = '/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'

    subprocess.run([
        editor,
        '--new-window',
        '--wait',
        file
    ], text=True)

    with open(file) as edited_file:
        edited_file_string = edited_file.read()
    return edited_file_string


def update_spaces_stats(spaces_dir):
    spaces = os.listdir(spaces_dir)

    with open(f'{spaces_dir}/all/notes/all/all.html', 'w') as index:
        index.write('<ol>\n')
        for space in spaces:
            if space != '.DS_Store':
                space_notes_n = len(glob(f'{spaces_dir}/{space}/*.html'))
                index.write(f'<li><code><a href=\'{space}\'>{space}</a></code> <code>{space_notes_n}</code> </li>\n')
        index.write('</ol>\n')
