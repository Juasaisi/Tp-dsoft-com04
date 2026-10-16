import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
 
/**
 * Modal de confirmación reutilizable con el estilo de la app.
 * - Recibe datos del padre mediante @Input (título, mensaje, textos de botones).
 * - Avisa al padre qué decidió la persona mediante @Output (confirmar / cancelar).
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements AfterViewInit {
  @Input() titulo = '¿Confirmar acción?';
  @Input() mensaje = '';
  @Input() textoConfirmar = 'Confirmar';
  @Input() textoCancelar = 'Cancelar';
  /** Si es true, el botón de confirmar se muestra en rojo (acciones destructivas). */
  @Input() peligro = false;
 
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
 
  @ViewChild('btnCancelar') private btnCancelar?: ElementRef<HTMLButtonElement>;
 
  ngAfterViewInit(): void {
    // El foco arranca en "Cancelar": evita borrar por apretar Enter sin querer.
    this.btnCancelar?.nativeElement.focus();
  }
 
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cancelar.emit();
  }
 
  onFondoClick(event: MouseEvent): void {
    // Solo cierra si se hizo clic en el fondo oscuro, no dentro de la tarjeta.
    if (event.target === event.currentTarget) {
      this.cancelar.emit();
    }
  }
}