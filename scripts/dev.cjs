const { spawn } = require('node:child_process')
const { waitFor } = require('./waitForHttp.cjs')

function run(cmd, args, opts) {
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...opts,
  })
  child.on('exit', (code) => {
    if (code !== 0) {
      process.exit(code ?? 1)
    }
  })
  return child
}

async function main() {
  const port = process.env.VITE_PORT || '5173'
  const url = `http://localhost:${port}`

  run('npm', ['run', 'dev:vite'], { env: { ...process.env, VITE_PORT: port } })
  await waitFor(url, 30000)

  run(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['electron', '.'],
    { env: { ...process.env, ELECTRON_RENDERER_URL: url } },
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
