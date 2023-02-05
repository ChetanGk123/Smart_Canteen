import { NgModule } from '@angular/core';

import { InitialsPipe } from './initials.pipe';

import { SafePipe } from './safe.pipe';

@NgModule({
    declarations: [InitialsPipe, SafePipe],
    imports: [],
    exports: [InitialsPipe, SafePipe],
})
export class CorePipesModule {}
