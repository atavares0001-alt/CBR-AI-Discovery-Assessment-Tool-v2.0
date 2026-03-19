import Image from 'next/image'

const sizes = {
  sm: { height: 36, width: 264 },
  md: { height: 52, width: 381 },
  lg: { height: 80, width: 587 },
} as const

interface LogoProps {
  size?: keyof typeof sizes
  className?: string
}

export function Logo({ size = 'sm', className = '' }: LogoProps) {
  const { height, width } = sizes[size]

  return (
    <Image
      src="/branding/logo-transparent-white.svg"
      alt="Canberra AI Agency"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}

export function SlideWatermark() {
  return (
    <div className="absolute bottom-4 right-6 z-10 opacity-40 sm:bottom-6 sm:right-8">
      <Image
        src="/branding/logo-transparent-white.svg"
        alt="Canberra AI Agency"
        width={176}
        height={24}
        className="pointer-events-none"
      />
    </div>
  )
}
