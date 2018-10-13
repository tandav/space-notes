import os
import subprocess
from glob import glob


def get_notes(space_dir):
    # notes = []


    notes = [x for x in os.listdir(f'{space_dir}/notes') if x != '.DS_Store']
    # for item in os.listdir(space_dir + '/notes'):
        # if item != '.DS_Store':
            # print(item)
    print(notes)
    
    notes_sorted = sorted(
        notes,
        key=lambda x: os.path.getmtime(f'{space_dir}/notes/{x}/{x}.html')
    )
    print(notes_sorted)

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
                # print(os.path.basename(ext))

            # print(ext, os.path.exists(ext))
        
        # if os.path.exists(png):
            # note_item['image'] = note + '.png'
        # if os.path.exists(jpg):
            # note_item['image'] = note + '.jpg'
        # if os.path.exists(jpeg):
            # note_item['image'] = note + '.jpeg'

        print(note_item)
        notes_json.append(note_item)

    return notes_json
        # if os.path.exists(f'{space_dir}/notes/{x}/{x}.png')  or \
           # os.path.exists(f'{space_dir}/notes/{x}/{x}.jpg')  or \
           # os.path.exists(f'{space_dir}/notes/{x}/{x}.jpeg'):
            # note_item['image'] = 


    # print(os.listdir(space_dir + '/notes'))
    # if os.path.exists(f'{space_dir}/images'):
    #     images = [x for x in os.listdir(f'{space_dir}/images') if x != '.DS_Store']
    # else:
    #     images = []
    
    
    # for note in sorted(glob(f'{space_dir}/*.html'), key=lambda x: os.path.getmtime(x)):
    #     hash = os.path.splitext(os.path.basename(note))[0]
        
        
    #     note_item = {'hash': hash}

    #     with open(note) as note_html:
    #         note_item['html'] =  note_html.read()
            
    #     for image in images:
    #         if hash == os.path.splitext(image)[0]:
    #             note_item['image'] = image
    #             break
        
    #     notes.append(note_item)
    # return notes


def get_files(dir):

    items   = []
    files   = []
    folders = []

    # for item in os.listdir(dir):
    #     if item[-5:] != '.html' and item != '.DS_Store':
    #         if os.path.isfile(f'{dir}/{item}'):
    #             files.append({ 'name' : item, 'type' : 'file' })
    #         else:
    #             folders.append({ 'name' : item, 'type' : 'folder' })
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

    with open(f'{spaces_dir}/all/all.html', 'w') as index:
        index.write('<ol>\n')
        for space in spaces:
            if space != '.DS_Store':
                space_notes_n = len(glob(f'{spaces_dir}/{space}/*.html'))
                index.write(f'<li><code><a href=\'{space}\'>{space}</a></code> <code>{space_notes_n}</code> </li>\n')
        index.write('</ol>\n')
