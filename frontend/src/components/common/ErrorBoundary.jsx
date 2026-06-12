import { Component } from 'react';
import Button from '@/components/ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-milk-soft px-4">
        <div className="text-center max-w-md space-y-4">
          <span className="text-6xl block">😕</span>
          <h2 className="font-display text-2xl text-slate-800">Something went wrong</h2>
          <p className="text-slate-500 text-sm">
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
