import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";

const CreateRoute = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Creat Post</h1>
        <p className="text-xl text-muted-foreground pt-4">Share your thoughts with the big world...</p>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create blog article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>

        <CardContent>
          <form >
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateRoute