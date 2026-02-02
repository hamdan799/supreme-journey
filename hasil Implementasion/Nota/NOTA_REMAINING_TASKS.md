# 🧩 NOTA SERVICE — REMAINING TASKS & ROADMAP

**Version:** v2.7.2  
**Date:** 5 Januari 2026

---

## 1. IMPLEMENTATION STATUS

### ✅ Phase 1: Complete (See Core Blueprint)

- Dialog Entry (`NSDlg.tsx`) - DONE
- Detail Page (`NSDetailPage.tsx`) - DONE
- Diagnosis Component (`NSDiag.tsx`) - DONE
- Action Log (`NSActLog.tsx`) - DONE
- Sub-Order (`NSSubOrd.tsx`) - DONE
- Cost Summary (`NSCSum.tsx`) - DONE
- Final Result (`NSFinal.tsx`) - DONE

---

### 🚧 Phase 2: Integration (TODO)

#### **Files to Update:**

1. `/components/Nota/NSPage.tsx` (List Page)
   - [x] Add "View Detail" button di NSItem
   - [x] Display state badge (color-coded)
   - [x] Display estimasi (opsional)
   - [x] Click row → navigate to detail
   - [ ] HARGA FINAL display rule (FINALIZED only)

2. `/App.tsx` (Routing)
   - [x] Add route: `/nota/service/:id` → NSDetailPage
   - [x] Pass props: notaId, nota, products, categories
   - [x] Connect onUpdate & onFinalize handlers

3. `/hooks/useNotaStore.ts` (State Management)
   - [x] Add `updateNota(id, updates)` function (Already exists)
   - [x] Add `finalizeNota(id, finalData)` function
   - [x] Update state management for auto-transition

---

## 2. TESTING CHECKLIST (REMAINING)

### 🚧 Phase 2 Testing (TODO)

#### List Page (NSPage)
- [ ] List displays all notas
- [ ] State badge color-coded
- [ ] Estimasi displays (opsional)
- [ ] HARGA FINAL displays ONLY if FINALIZED
- [ ] Click row → navigate to detail
- [ ] Add nota button works
- [ ] Filter by state works
- [ ] Search works

#### Integration
- [ ] Create nota → list updates
- [ ] Update nota → list updates
- [ ] Finalize nota → list updates
- [ ] Route `/nota/service/:id` works
- [ ] Props passed correctly
- [ ] onUpdate handler works
- [ ] onFinalize handler works

#### Data Persistence
- [ ] Estimasi NOT saved as final
- [ ] Estimasi NOT in POS
- [ ] Estimasi NOT in laporan
- [ ] Harga final masuk POS
- [ ] Harga final masuk laporan
- [ ] Harga final masuk history
- [ ] FINALIZED → cannot edit (immutable)

---

## 3. NEXT STEPS

### 🔥 Immediate (Critical Path)

1. **Update NSPage.tsx** (List Page)
   ```typescript
   // Add in NSItem component
   <Button
     variant="ghost"
     size="sm"
     onClick={() => navigate(`/nota/service/${nota.id}`)}
   >
     View Detail →
   </Button>
   
   // Display harga final rule
   {nota.service_state === 'FINALIZED' && (
     <div className="font-bold">
       Rp {nota.harga_final?.toLocaleString()}
     </div>
   )}
   ```

2. **Update App.tsx** (Routing)
   ```typescript
   import { NSDetailPage } from './components/Nota/NSDetailPage';
   
   // Add route
   <Route
     path="/nota/service/:id"
     element={
       <NSDetailPage
         notaId={id}
         nota={nota}
         products={products}
         categories={categories}
         onUpdate={handleUpdateNota}
         onFinalize={handleFinalizeNota}
       />
     }
   />
   ```

3. **Update useNotaStore.ts** (State Management)
   ```typescript
   // Add functions
   updateNota: (id: string, updates: Partial<NotaService>) => void;
   finalizeNota: (id: string, finalData: {
     service_result: FinalResult;
     root_cause: RootCause;
     harga_final?: number;
   }) => void;
   ```

4. **Test Full Flow**
   - Create nota (dialog) → Status DRAFT
   - Open detail → Add step → Auto IN_PROGRESS
   - Add sub-order → Auto WAITING_PART
   - Resolve sub-order → Back to IN_PROGRESS
   - Fill final result → Finalize → FINALIZED
   - Check list → Harga final displays

---

### 🚀 Phase 2 (Future Enhancements)

1. **Catalog Picker Integration**
   - Section D: "Ambil dari Katalog"
   - Product search & select
   - Set estimasi harga (editable)
   - Mark as USED / TESTED_UNUSED

2. **Harga Final Calculation**
   - Generate dari estimasi + adjustments
   - Support diskon/markup
   - Lock on FINALIZED

3. **Print Service Report**
   - Generate PDF
   - Include all sections
   - Logo & header
   - Customer signature area

4. **WhatsApp Notification**
   - Notify customer when FINALIZED
   - Include summary & total
   - Link to track (optional)

5. **Analytics Integration**
   - Send data to analytics module
   - Track success rate
   - Track common failures
   - Track avg time to finalize

6. **AI Compatibility Integration**
   - Event-based tracking
   - FINALIZED SUCCESS → record compatibility
   - Build compatibility data
   - Auto-suggest sparepart based on history

---

### 📊 Phase 3 (Advanced Features)

1. **Batch Operations**
   - Bulk update state
   - Bulk print reports
   - Export to Excel

2. **Advanced Search & Filter**
   - Filter by date range
   - Filter by result (SUCCESS/FAILED)
   - Filter by customer
   - Filter by device brand/model

3. **Performance Metrics**
   - Avg time DRAFT → FINALIZED
   - Technician leaderboard
   - Success rate per technician
   - Most common failures

4. **Customer Portal**
   - Track nota status online
   - Real-time updates
   - Upload additional info
   - Approve estimasi
