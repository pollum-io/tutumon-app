import { Layout } from '@/layouts/'

import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Steps from '@/components/Step'

export default function Home() {
  return (
    <Layout.LandingPage>
      <div className="my-auto flex flex-col gap-y-16 ">
        <Steps order={1} title="Await the Launch 🚀">
          The NearPal Chrome extension will be available soon on the Chrome Web
          Store. Stay tuned for updates!
        </Steps>

        <Steps order={2} title="Install the Chrome Extension 🧩">
          Once launched, navigate to the Chrome Web Store and search for{' '}
          <span className="font-bold text-[#0FF089]">NearPal</span>. Click on{' '}
          <span className="font-bold text-[#0FF089]">Add to Chrome</span> to
          install the NearPal extension.
        </Steps>

        <Steps order={3} title="Be Happy! 🎉">
          <span className="font-bold text-[#0FF089]">Enjoy</span> the immediate
          benefits of having NearPal installed. You now have a personal
          companion for everything{' '}
          <span className="font-bold text-[#0FF089]">web3</span> and{' '}
          <span className="font-bold text-[#0FF089]">Near</span> related.
        </Steps>

        <Steps order={4} title="Go to NearPal.org 🐙">
          <span className="font-bold text-[#0FF089]"> Navigate</span> to{' '}
          <Link
            className="font-bold text-[#0FF089]"
            href="https://Nearpal.org/"
          >
            nearpal.org
          </Link>{' '}
          (Right here I guess)
        </Steps>

        <Steps order={5} title="Login to Your Wallet 🔑">
          <span className="font-bold text-[#0FF089]"> Click </span> on the
          <span className="font-bold text-[#0FF089]">
            {' '}
            &ldquo;Launch App&rdquo;{' '}
          </span>
          button located at the top-right corner of the website. Choose your
          preferred wallet provider and follow the prompts to connect your
          wallet to NearPal.
        </Steps>

        <Steps order={6} title="Select an NFT to Be Your Pal 🙊">
          <span className="font-bold text-[#0FF089]">Browse</span> through the
          available NFTs that can be your &ldquo;Pal&rdquo; at profile tab.
          Select your favorite and save.
        </Steps>

        <Steps order={7} title="Be Happy (Again) 🎉">
          <span className="font-bold text-[#0FF089]"> Enjoy</span> the
          personalized and interactive experience that your chosen NFT Pal
          brings to your web3 and{' '}
          <span className="font-bold text-[#0FF089]">Near journey.</span>
        </Steps>
      </div>
    </Layout.LandingPage>
  )
}
