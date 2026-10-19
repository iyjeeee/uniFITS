// itemDetail/ItemHero.tsx — 160px hero banner: photo, or default illustration + title/description overlay; status badge top-right
import type { CSSProperties } from 'react'
import { StatusBadge } from '../ui'
import DefaultPhoto from './DefaultPhoto'
import type { ItemKind } from './itemDetailShared'
import type { Project, AppEvent } from '../../types'

interface Props { item: Project | AppEvent; kind: ItemKind; accentC: string }

export default function ItemHero({ item, kind, accentC }: Props) {
  // photo_url only exists on some items — checked safely
  const photoSrc = (item as unknown as Record<string, unknown>).photo_url as string | undefined
  return (
  <div style={{ height: 160, borderRadius: 14, overflow: 'hidden', position: 'relative', background: accentC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {photoSrc
      ? <img src={photoSrc} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : (
        <>
          <div style={{ opacity: .18 }}><DefaultPhoto kind={kind} color="#fff" /></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '18px 20px' }}>
            <div style={{ background: 'rgba(0,0,0,.52)', borderRadius: 10, padding: '10px 16px', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{item.title}</div>
              {item.description && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.80)', marginTop: 4, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as CSSProperties}>
                  {item.description}
                </div>
              )}
            </div>
          </div>
        </>
      )
    }
    <div style={{ position: 'absolute', top: 12, right: 12 }}><StatusBadge status={item.status} /></div>
  </div>
  )
}
