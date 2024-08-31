
const FooterComponent = () => {
    return (
        <footer className="bg-pink-700 text-slate-100 relative bottom-0 left-0 right-0">
        <div className="flex">
          <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 
             px-4 py-6">
            <p className="text-sm">© {new Date().getFullYear()} Lorenzo Furrer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
}

export default FooterComponent;