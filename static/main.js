import { createRouter } from 'https://unpkg.com/@nicolasparada/router@0.8.0/router.js';
import { guard } from './auth.js';
import { importWithCache } from './dynamic-import.js';

const viewAccess = location.hostname === 'localhost' ? view('dev-access') : view('access')

const r = createRouter()
r.route('/', guard(view('home'), viewAccess))
r.route('/callback', view('callback'))
r.route(/^\/conversations\/([^\/]+)$/, guard(view('conversation'), viewAccess))
r.route(/^\//, view('not-found'))
r.subscribe(render)
r.install()

function view(pageName) {
    return (...args) => importWithCache(`/pages/${pageName}-page.js`)
        .then(m => m.default(...args))
}

async function render(resultPromise) {
    document.body.innerHTML = ''
    const result = await resultPromise
    if (result instanceof Node) {
        document.body.appendChild(result)
    }
}
