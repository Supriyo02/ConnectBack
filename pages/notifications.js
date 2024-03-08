import Link from "next/link";
import Avatar from "../components/avatar";
import Card from "../components/card";
import Layout from "../components/layout";

export default function Notifications(){
    return(
        <Layout>
            <h1 className=" text-3xl font-bold text-gray-400 mb-4">Notifications</h1>
            <Card>
                <div className="flex gap-1 items-center border-b border-b-gray-200 p-1">
                    <Link href={'/profile'}><Avatar /></Link>
                    <div>
                        <Link className=" text-SocialBlue hover:underline font-semibold" href={'/profile'}>Susmita</Link> liked your photo
                    </div>
                </div>
                <div className="flex gap-1 items-center border-b border-b-gray-200 p-1">
                    <Link href={'/profile'}><Avatar /></Link>
                    <div>
                        <Link className=" text-SocialBlue hover:underline font-semibold" href={'/profile'}>Susmita</Link> liked your photo
                    </div>
                </div>
                <div className="flex gap-1 items-center border-b border-b-gray-200 p-1">
                    <Link href={'/profile'}><Avatar /></Link>
                    <div>
                        <Link className=" text-SocialBlue hover:underline font-semibold" href={'/profile'}>Susmita</Link> liked your photo
                    </div>
                </div>
                <div className="flex gap-1 items-center border-b border-b-gray-200 p-1">
                    <Link href={'/profile'}><Avatar /></Link>
                    <div>
                        <Link className=" text-SocialBlue hover:underline font-semibold" href={'/profile'}>Susmita</Link> liked your photo
                    </div>
                </div>
                <div className="flex gap-1 items-center border-b border-b-gray-200 p-1">
                    <Link href={'/profile'}><Avatar /></Link>
                    <div>
                        <Link className=" text-SocialBlue hover:underline font-semibold" href={'/profile'}>Susmita</Link> liked your photo
                    </div>
                </div>
                <div className="flex gap-1 items-center border-b border-b-gray-200 p-1">
                    <Link href={'/profile'}><Avatar /></Link>
                    <div>
                        <Link className=" text-SocialBlue hover:underline font-semibold" href={'/profile'}>Susmita </Link>liked your photo
                    </div>
                </div>
            </Card>
        </Layout>
    )
}