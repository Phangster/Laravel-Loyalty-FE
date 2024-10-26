import { Button } from "@/components/ui/button";
import { AppContext, AppContextType } from "@/context/AppContext";
import { Item } from "@/types/Item";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"

const Show: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useContext(AppContext) as AppContextType;
    const [item, setItem] = useState<Item | null>(null);

    const getItem = async () => {
        const res = await fetch(`/api/items/${id}`)
        const data = await res.json();
        if (res.ok) {
            setItem(data.item)
        }
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();

        if (user?.id === item?.user_id) {
            const res = await fetch(`/api/items/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            await res.json();
            if (res.ok) {
                navigate('/')
            }
        }
    }

    useEffect(() => {
        getItem()
    }, [])

    return <>
        {item ? (
            <div key={item.id} className="flex justify-between">
                <div>
                    <div>
                        <h2>{item.name}</h2>
                        <small>Created by {item.user.name} ons {new Date(item.created_at).toLocaleTimeString()}</small>
                    </div>
                    <p>{item.description}</p>
                    {user?.id === item.user_id && <div>
                        <Link to={`/items/update/${item.id}`}>Update</Link>
                        <form onSubmit={handleDelete}>
                            <Button>Delete</Button>
                        </form>
                    </div>}
                </div>
            </div>
        ) : <p>Item not found!</p>}
    </>
}

export default Show