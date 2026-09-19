import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'OmniConvert';
    const desc = searchParams.get('desc') || 'Universal Client-Side Media & Text Suite';
    const cat = searchParams.get('cat') || 'Utility';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#09090b',
            padding: '60px',
            fontFamily: 'sans-serif',
            border: '2px solid #27272a',
          }}
        >
          {/* Header Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              ⚡
            </div>
            <span
              style={{
                color: '#f4f4f5',
                fontSize: '28px',
                fontWeight: 'bold',
                letterSpacing: '-0.5px',
              }}
            >
              OmniConvert
            </span>
            <span
              style={{
                padding: '6px 16px',
                borderRadius: '999px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}
            >
              {cat}
            </span>
          </div>

          {/* Main Title & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px' }}>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: '1.1',
                margin: 0,
                letterSpacing: '-1px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '22px',
                color: '#a1a1aa',
                lineHeight: '1.4',
                margin: 0,
              }}
            >
              {desc}
            </p>
          </div>

          {/* Footer Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: '24px',
              borderTop: '1px solid #27272a',
            }}
          >
            <span style={{ color: '#10b981', fontSize: '18px', fontWeight: '600' }}>
              ✓ 100% Free • Client-Side Privacy • Zero Uploads
            </span>
            <span style={{ color: '#71717a', fontSize: '18px', fontFamily: 'monospace' }}>
              omniconvert.app
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
