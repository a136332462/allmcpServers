import fs from 'fs';
import path from 'path';
import ResourceList from '@/components/ResourceList'
import Link from 'next/link'
import Image from "next/image";


export const metadata = {
  title: 'All Resources',
  description: 'Explore our curated list of resources for web development, GitHub, and more.',
}

export default function Resources() {
  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'all.json');
  const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));

  return (
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">All Resources</h1>
          <Link
              href="/"
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-primary h-9 px-4 py-2"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
              <div key={resource.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-muted">
                      {resource.icon ? (
                          <Image
                              src={resource.icon}
                              alt={resource.name}
                              width={32} // 必须添加
                              height={32} // 必须添加
                              className="w-8 h-8"
                          />                      ) : (
                          <span className="text-2xl">{resource.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">{resource.category}</p>
                    </div>
                  </div>
                  <p className="text-sm">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-3"
                    >
                      Visit
                    </a>
                    {resource.docs && (
                        <a
                            href={resource.docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          Docs
                        </a>
                    )}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  )
}