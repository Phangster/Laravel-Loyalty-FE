import { Reward } from "@/types/Reward";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";


const Home = () => {
    const [rewards, setRewards] = useState<Reward[]>([])
    const getItems = async () => {
        const res = await fetch('/api/rewards')
        const data = await res.json();
        setRewards(data)
    }

    useEffect(() => {
        getItems()
    }, [])

    return (
        <>
            <h1 className="title">Rewards</h1>
            {rewards.length > 0 ?
                <div className="grid grid-cols-3 gap-2">
                    {rewards.map(reward => (
                        <Card key={reward.id}>
                            <CardHeader>
                                <CardTitle>{reward.name}</CardTitle>
                                <CardDescription>{reward.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Card Content</p>
                            </CardContent>
                            <CardFooter className="flex gap-x-4 w-full justify-end">
                                <Button>Claim</Button>
                                <Button>Delete</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                : <p>There are no Rewards</p>}
        </>
    )
}

export default Home;