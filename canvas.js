(function(){
  var MAX = 8 * 1024 * 1024;
  var TYPES = ['image/png', 'image/jpeg', 'image/webp'];
  var KEY = 'taven-canvas-projects-v1';
  var $ = function (id) { return document.getElementById(id); };
  var drop = $('drop'), fileIn = $('file'), prev = $('preview'), prevImg = $('previewImg');
  var actions = $('imgActions'), msg = $('msg'), desc = $('desc'), name = $('name');
  var image = null; // { blob, url, type, name }

  function say(text, kind) { msg.className = 'msg ' + (kind || ''); msg.textContent = text; }

  function setImage(file) {
    if (TYPES.indexOf(file.type) === -1) { say('That file type is not supported. Use PNG, JPG or WEBP.', 'err'); return; }
    if (file.size > MAX) { say('That image is too large. The limit is 8 MB.', 'err'); return; }
    if (image && image.url) URL.revokeObjectURL(image.url);
    image = { blob: file, url: URL.createObjectURL(file), type: file.type, name: file.name };
    prevImg.src = image.url; prev.hidden = false; actions.hidden = false;
    drop.querySelector('.drop-title').textContent = 'Sketch ready';
    say('Image added. Describe your idea and save the project when you are ready.', 'ok');
  }
  function removeImage() {
    if (image && image.url) URL.revokeObjectURL(image.url);
    image = null; prevImg.removeAttribute('src'); prev.hidden = true; actions.hidden = true;
    fileIn.value = ''; drop.querySelector('.drop-title').textContent = 'Drop your sketch here';
    say('Image removed.', 'ok');
  }

  drop.addEventListener('click', function () { fileIn.click(); });
  drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileIn.click(); } });
  fileIn.addEventListener('change', function () { if (fileIn.files[0]) setImage(fileIn.files[0]); });
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) { var f = e.dataTransfer.files[0]; if (f) setImage(f); });
  $('replace').addEventListener('click', function () { fileIn.click(); });
  $('remove').addEventListener('click', removeImage);
  $('download').addEventListener('click', function () {
    if (!image) return;
    var a = document.createElement('a'); a.href = image.url; a.download = image.name || 'sketch'; document.body.appendChild(a); a.click(); a.remove();
  });

  desc.addEventListener('input', function () { $('count').textContent = desc.value.length + ' / 2000'; });

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function store(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }

  function render() {
    var list = load(), ul = $('list');
    ul.innerHTML = '';
    if (!list.length) { ul.innerHTML = '<li class="empty">No saved projects yet.</li>'; return; }
    list.forEach(function (p, i) {
      var li = document.createElement('li');
      var b = document.createElement('b'); b.textContent = p.name;
      var s = document.createElement('small'); s.textContent = new Date(p.savedAt).toLocaleString() + (p.hasImage ? ' · sketch attached (not stored)' : ' · no sketch');
      var acts = document.createElement('div'); acts.className = 'acts';
      var open = document.createElement('button'); open.type = 'button'; open.textContent = 'Load text';
      open.onclick = function () { name.value = p.name; desc.value = p.description; $('count').textContent = p.description.length + ' / 2000'; say('Loaded "' + p.name + '". Re-add the sketch if you need it.', 'ok'); };
      var del = document.createElement('button'); del.type = 'button'; del.textContent = 'Delete';
      del.onclick = function () { if (confirm('Delete this saved project?')) { list.splice(i, 1); store(list); render(); } };
      acts.appendChild(open); acts.appendChild(del);
      li.appendChild(b); li.appendChild(s); li.appendChild(acts); ul.appendChild(li);
    });
  }

  $('save').addEventListener('click', function () {
    var n = name.value.trim(), d = desc.value.trim();
    if (!n) { say('Give your project a name first.', 'err'); name.focus(); return; }
    if (!d && !image) { say('Add a sketch or a description before saving.', 'err'); return; }
    var list = load();
    list.unshift({ name: n, description: d, hasImage: !!image, savedAt: new Date().toISOString() });
    if (!store(list)) { say('Could not save in this browser. Storage may be full or disabled.', 'err'); return; }
    render(); say('Project saved on this device.', 'ok');
  });

  $('clear').addEventListener('click', function () {
    if (!confirm('Clear the workspace? Unsaved changes will be lost.')) return;
    name.value = ''; desc.value = ''; $('count').textContent = '0 / 2000'; removeImage(); say('Workspace cleared.', 'ok');
  });

  render();
})();
