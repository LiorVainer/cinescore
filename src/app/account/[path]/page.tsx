import {AccountView} from "@daveyplate/better-auth-ui"
import {accountViewPaths} from "@daveyplate/better-auth-ui/server"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Home} from "lucide-react"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(accountViewPaths).map((path) => ({ path }))
}

export default async function AccountPage({ params }: { params: { path: string } }) {
    const { path } = params

    return (
        <main className="container h-screen p-4 md:p-6">
            <div className="mb-4">
                <Button asChild variant="outline" size="sm">
                    <Link href="/" aria-label="Go to main screen" className="flex items-center gap-2">
                        <Home className="size-4" />
                        <p> חזור למסך ראשי</p>
                    </Link>
                </Button>
            </div>
            <AccountView  path={path} />
        </main>
    )
}