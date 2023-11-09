import { Layout } from '@/layouts/'

import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Steps from '@/components/Step'

export default function Home() {
  return (
    <Layout.LandingPage>
      <div className="my-auto flex flex-col gap-y-16 ">

        <Steps order={1} title="Install the Chrome Extension 🧞‍♀️">
          Clone the{' '}
          <span className="font-bold text-[#FF7DA1]">TuTu Monster</span>{' '}
          Github extension repo and follow the instructions to install{' '}
        </Steps>

        <Steps order={2} title="Be Happy! 🎉">
          <span className="font-bold text-[#FF7DA1]">Enjoy</span> the immediate
          benefits of having TuTu Monster installed. You now have a personal
          companion for everything{' '}
          <span className="font-bold text-[#FF7DA1]">Near</span> related.
        </Steps>

        <Steps order={3} title="Go to Tutu.monster">
          <span className="font-bold text-[#FF7DA1]"> Navigate</span> to{' '}
          <Link
            className="font-bold text-[#FF7DA1]"
            href="https://tutu.monster/"
          >
            tutu.monster
          </Link>{' '}
        </Steps>

        <Steps order={4} title="Login to Your Wallet 🔑">
          <span className="font-bold text-[#FF7DA1]"> Click </span> on the
          <span className="font-bold text-[#FF7DA1]">
            {' '}
            &ldquo;Launch App&rdquo;{' '}
          </span>
          button located at the top-right corner of the website. Choose your
          preferred wallet provider and follow the prompts to connect your
          wallet to Tutu.
        </Steps>

        <Steps order={6} title="Select an NFT to Be Your Pal 🙊">
          <span className="font-bold text-[#FF7DA1]">Browse</span> through the
          available NFTs that can be your &ldquo;Monster&rdquo; at profile tab.
          Select your favorite and save.
        </Steps>

        <Steps order={7} title="Be Happy (Again) 🎉">
          <span className="font-bold text-[#FF7DA1]"> Enjoy</span> the
          personalized and interactive experience that your chosen NFT companion
          brings to your{' '}
          <span className="font-bold text-[#FF7DA1]">Near journey.</span>
        </Steps>
      </div>
    </Layout.LandingPage>
  )
}
