import Image from 'next/image';

/**
 * Decorative SJSU campus scenery cropped from SpartanCircle's landing
 * screenshot (Tower Hall on the left, campus buildings on the right).
 * Hidden below md since the source art is a fixed-height illustration
 * that would crowd small viewports.
 */
export function CampusWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden md:block" aria-hidden="true">
      <Image
        src="/images/watermark-left.png"
        alt=""
        width={480}
        height={1080}
        className="absolute bottom-0 left-0 h-full max-h-[900px] w-auto opacity-60 [mask-image:linear-gradient(to_top,black_85%,transparent)]"
      />
      <Image
        src="/images/watermark-right.png"
        alt=""
        width={570}
        height={970}
        className="absolute bottom-0 right-0 h-full max-h-[900px] w-auto opacity-60 [mask-image:linear-gradient(to_top,black_85%,transparent)]"
      />
    </div>
  );
}
