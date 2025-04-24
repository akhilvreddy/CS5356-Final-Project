export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Learn more about our project and our mission.
          </p>
        </div>
      </section>

      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
        <div className="prose lg:prose-lg mx-auto">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
          </p>
          <p>
            Suspendisse in orci enim. Donec suscipit ante in hendrerit scelerisque. Praesent dapibus elit vel dui elementum, et sagittis elit pellentesque. Suspendisse potenti. Cras varius pulvinar dolor. Etiam tempor ipsum nec pharetra dignissim.
          </p>
          <p>
            Nullam pretium et purus ac tincidunt. Fusce quis libero congue, tempus urna non, euismod dui. Nulla facilisi. Donec vulputate risus vel nisi fermentum, non molestie diam elementum. In non bibendum urna, sit amet accumsan nisl.
          </p>
        </div>
      </section>

      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">John Doe</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Jane Smith</h3>
            <p className="text-gray-600">CTO</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Mike Johnson</h3>
            <p className="text-gray-600">Lead Developer</p>
          </div>
        </div>
      </section>
    </div>
  );
} 