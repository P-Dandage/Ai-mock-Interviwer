import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Hello Pratham
      <Link href={'/dashboard'}>
       <Button>Click  </Button>
      </Link>
     
    </div>
     );
}
