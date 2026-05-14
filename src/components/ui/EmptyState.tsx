import { ReactNode } from 'react';
import { Sparkle } from '@phosphor-icons/react';
import { Card } from './Card';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  aiHint?: string;
  cta?: ReactNode;
}

export function EmptyState({ icon, title, description, aiHint, cta }: Props) {
  return (
    <Card className="text-center py-10 px-6 flex flex-col items-center gap-3">
      <div className="text-brand-500 text-4xl">{icon ?? <Sparkle weight="duotone" size={48} />}</div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-fg-3 max-w-md">{description}</p>}
      {aiHint && (
        <div className="mt-2 inline-flex items-center gap-2 text-sm bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-200 rounded-full px-3 py-1.5">
          <Sparkle weight="fill" size={14} />
          {aiHint}
        </div>
      )}
      {cta && <div className="mt-3">{cta}</div>}
    </Card>
  );
}
