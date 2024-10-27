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
import CreateReward from "./components/modals/CreateReward";


const RewardPage = () => {
    const [rewards, setRewards] = useState<Reward[]>([])
    const getRewards = async () => {
        const res = await fetch('/api/rewards')
        const data = await res.json();
        setRewards(data)
    }

    useEffect(() => {
        getRewards()
    }, [])

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="title">Rewards</h1>
                <CreateReward>Create a Reward</CreateReward>
            </div>
            {rewards.length > 0 ?
                <div className="grid grid-cols-3 gap-2">
                    {rewards.map(reward => (
                        <Card key={reward.id}>
                            <CardHeader className="h-30">
                                <CardTitle>{reward.name}</CardTitle>
                                <CardDescription>{reward.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-neutral-50 h-40 rounded-lg flex items-center justify-center">Card Content</div>
                                <p className="pt-3 text-sm">Created by : {reward.user.name}</p>
                            </CardContent>
                            <CardFooter className="flex flex-col w-full items-start gap-y-2">
                                <div className="flex gap-x-4">
                                    <Button>Claim</Button>
                                    <Button>Delete</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                : <p>There are no Rewards</p>}
        </>
    )
}

export default RewardPage;