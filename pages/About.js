import { Users, User } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">

            {/* TOP BAR */}
            <div className="border-b border-[var(--border-soft)]">
                <div className="w-full px-4 sm:px-6 lg:px-10 py-3 flex justify-between text-sm">
                    <span className="text-[var(--accent)] cursor-pointer">&lt; Back</span>
                    <span className="text-gray-300">About</span>
                    <span />
                </div>
            </div>

            {/* CONTENT */}
            <div
                className="
          w-full
          px-4 sm:px-6 lg:px-16 xl:px-24
          py-10 sm:py-14 lg:py-20
          grid
          grid-cols-1
         
          gap-12 xl:gap-24
        "
            >
                {/* LEFT */}
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6">
                        Massage Republic was created to serve the needs of users and providers of adult services
                    </h1>

                    <Section
                        title="What is it for?"
                        text={`Providers can list a detailed and information profile in Massage Republic where they can propose their time and companionship to others.
      Users of the site can then make contact directly. We do not act as an intermediary or play any role in any transaction which may eventually take place.
We recommend you follow the local laws of the country in which you reside.`}
                    />

                    <Section
                        title="Why are we different?"
                        text={`We have spent a lot of time communicating with users and advertisers to produce a website which is as useful as possible.
Features such as verified photos, user reviews, questions and SSL security all help this to happen.
We want users and providers to find Massage Republic useful and are working hard to make that happen.

We also have a social mission to help victims of human trafficking.`}
                    />

                    <h2 className="text-base sm:text-lg font-semibold mt-10 mb-6">
                        What are people saying?
                    </h2>

                    <Quote
                        text={`If I am honest I thought when you said "We will remove all the fake listings", in your last mail, that you were pulling my leg (so to speak...). But you have done pretty much what you said, and the site is greatly improved. You cannot find a forum here now which does not talk about Massage Republic and the verified profiles being real. What I want is value for my money and a site that goes to the extent that MR does to ensure that I at least get the girl in the picture is in my opinion worth a few extra dirham.`}
                        author="— Kabul Guy"
                    />

                    <Quote
                        text={`Massage Republic has quickly been classed as a reputable site with verified girls and an option to review the lady you visit.
You will not find the cheap and nasty (and I don't mean ugly) ladies who find their business in a bar to be advertising.
The ladies on Massage Republic are verified by the site and the punters are able to leave reviews, ask questions and communicate easily with the Escort.
NOT ALL MEN wish to have a wham Bam Fuck Fest and in actual fact there are many guys out there who are very keen to learn a little about the girl before she commits to a booking.`}
                        author="— Milly"
                    />

                    <Quote
                        text="Compliments to good website. Massage Republic is one of the best!"
                        author="— Jane Twin"
                    />

                    <Quote
                        text="Thank you for all your help and personal care you put into this site."
                        author="— Dela Luna"
                    />
                </div>


            </div>
        </div>

    )
}

function Section({ title, text }) {
    return (
        <div className="mb-8">
            <h2 className="text-base sm:text-lg font-semibold mb-2">
                {title}
            </h2>
            <p className="text-sm sm:text-[15px] text-gray-300 whitespace-pre-line leading-relaxed">
                {text}
            </p>
        </div>
    )
}

function Quote({ text, author }) {
    return (
        <div className="relative pl-5 sm:pl-6 mt-6">
            <span className="absolute left-0 top-0 h-full w-[2px] bg-[var(--accent)]" />
            <p className="text-sm sm:text-[15px] text-gray-200 leading-relaxed">
                {text}
            </p>
            <p className="text-xs text-gray-400 mt-2">
                {author}
            </p>
        </div>
    )
}
