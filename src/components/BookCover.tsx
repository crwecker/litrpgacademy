import Image from 'next/image'

interface BookCoverProps {
  title: string
  coverUrl: string | null
  sizes: string
  priority?: boolean
}

// Fixed 2:3 frame; books without art get a generated title plate.
export function BookCover({ title, coverUrl, sizes, priority }: BookCoverProps) {
  return (
    <div className='relative aspect-[2/3] w-full overflow-hidden rounded-md bg-panel shadow-lg shadow-black/40 ring-1 ring-line'>
      {coverUrl ? (
        <Image src={coverUrl} alt={`Cover of ${title}`} fill sizes={sizes} className='object-cover' priority={priority} />
      ) : (
        <div className='flex h-full flex-col justify-between bg-gradient-to-br from-panel-hi via-panel to-ink p-3'>
          <span className='h-px w-8 bg-copper' />
          <span className='line-clamp-5 font-serif text-sm leading-snug font-bold text-parchment'>{title}</span>
          <span className='h-px w-8 bg-copper' />
        </div>
      )}
    </div>
  )
}
