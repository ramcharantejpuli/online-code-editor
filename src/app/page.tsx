import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <CodeEditor />
    </main>
  )
}
