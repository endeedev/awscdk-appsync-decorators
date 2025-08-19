import { UnionType } from '@/decorators';

import { DiningSuggestion } from './dining-suggestion';
import { GlasswareSuggestion } from './glassware-suggestion';

@UnionType(GlasswareSuggestion, DiningSuggestion)
export class Suggestions {}
