import React, { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import {
  authApi,
  ShippingAddress,
  ShippingAddressInput,
} from "../auth/authApi";

const emptyAddress: ShippingAddressInput = {
  recipientName: "",
  phone: "",
  province: "",
  ward: "",
  addressLine: "",
  isDefault: false,
};

const fieldClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-[#342A2A] mb-1";

export const AccountSettings: React.FC = () => {
  const { user, refreshSession } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addressDraft, setAddressDraft] = useState<ShippingAddressInput>(emptyAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      setAddresses(await authApi.getAddresses());
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    void loadAddresses().catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải địa chỉ.");
    });
  }, []);

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setPhone(user?.phone ?? "");
  }, [user]);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setNotice("");
    try {
      await authApi.updateProfile({ fullName: fullName.trim(), phone: phone.trim() || null });
      await refreshSession();
      setNotice("Đã cập nhật hồ sơ.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể cập nhật hồ sơ.");
    } finally {
      setSavingProfile(false);
    }
  };

  const startEditing = (address: ShippingAddress) => {
    setEditingId(address.id);
    setAddressDraft({
      recipientName: address.recipientName,
      phone: address.phone,
      province: address.province,
      ward: address.ward,
      addressLine: address.addressLine,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
    setError("");
    setNotice("");
  };

  const startAdding = () => {
    setEditingId(null);
    setAddressDraft({ ...emptyAddress, isDefault: addresses.length === 0 });
    setShowAddressForm(true);
    setError("");
    setNotice("");
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingAddress(true);
    setError("");
    setNotice("");
    try {
      if (editingId === null) {
        await authApi.createAddress(addressDraft);
      } else {
        await authApi.updateAddress(editingId, addressDraft);
      }
      await loadAddresses();
      setShowAddressForm(false);
      setNotice(editingId === null ? "Đã thêm địa chỉ nhận hàng." : "Đã cập nhật địa chỉ.");
      setEditingId(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu địa chỉ.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSetDefault = async (addressId: number) => {
    setError("");
    setNotice("");
    try {
      await authApi.updateAddress(addressId, { isDefault: true });
      await loadAddresses();
      setNotice("Đã chọn địa chỉ mặc định.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể chọn địa chỉ mặc định.");
    }
  };

  const handleDelete = async (address: ShippingAddress) => {
    if (!window.confirm(`Xóa địa chỉ của ${address.recipientName}?`)) return;
    setError("");
    setNotice("");
    try {
      await authApi.deleteAddress(address.id);
      await loadAddresses();
      setNotice("Đã xóa địa chỉ.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa địa chỉ.");
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[#FFFCF8] rounded-3xl p-6 sm:p-8 border border-[#342A2A]/10 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68]">
            Hồ sơ khách hàng
          </p>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#342A2A] mt-1">
            Thông tin cá nhân
          </h2>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="account-full-name" className={labelClass}>Họ và tên</label>
            <input
              id="account-full-name"
              className={fieldClass}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              maxLength={100}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label htmlFor="account-phone" className={labelClass}>Số điện thoại</label>
            <input
              id="account-phone"
              className={fieldClass}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={20}
              autoComplete="tel"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <p className={`${fieldClass} text-[#342A2A]/60`}>{user?.email}</p>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="px-5 py-2.5 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#B98C68] disabled:opacity-60 transition"
          >
            {savingProfile ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
        </form>
      </div>

      <div className="bg-[#FFFCF8] rounded-3xl p-6 sm:p-8 border border-[#342A2A]/10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68]">
              Giao hàng
            </p>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#342A2A] mt-1">
              Địa chỉ nhận hàng
            </h2>
          </div>
          <button
            type="button"
            onClick={startAdding}
            className="px-4 py-2 rounded-full border border-[#B98C68]/50 text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D4C9] transition"
          >
            + Thêm địa chỉ
          </button>
        </div>

        {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
        {notice ? <p role="status" className="text-sm text-[#3E6B52]">{notice}</p> : null}
        {loadingAddresses ? (
          <p className="text-sm text-[#342A2A]/60" aria-busy="true">Đang tải địa chỉ...</p>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-[#342A2A]/60">Bạn chưa lưu địa chỉ nhận hàng nào.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="p-4 rounded-2xl bg-[#F7F1EA] border border-[#342A2A]/10 space-y-2"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold text-sm text-[#342A2A]">
                    {address.recipientName} <span className="font-normal text-[#342A2A]/65">· {address.phone}</span>
                  </p>
                  {address.isDefault ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#3E6B52] text-white text-[10px] font-semibold uppercase">
                      Mặc định
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-[#342A2A]/75">
                  {address.addressLine}, {address.ward}, {address.province}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  {!address.isDefault ? (
                    <button type="button" onClick={() => void handleSetDefault(address.id)} className="text-xs font-semibold text-[#3E6B52] underline">
                      Đặt làm mặc định
                    </button>
                  ) : null}
                  <button type="button" onClick={() => startEditing(address)} className="text-xs font-semibold text-[#342A2A] underline">
                    Sửa
                  </button>
                  <button type="button" onClick={() => void handleDelete(address)} className="text-xs font-semibold text-red-700 underline">
                    Xóa
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {showAddressForm ? (
          <form onSubmit={handleAddressSubmit} className="space-y-3 border-t border-[#342A2A]/10 pt-5">
            <h3 className="font-semibold text-[#342A2A]">
              {editingId === null ? "Thêm địa chỉ mới" : "Cập nhật địa chỉ"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                ["recipientName", "Tên người nhận", "name"],
                ["phone", "Số điện thoại", "tel"],
                ["province", "Tỉnh / thành phố", "address-level1"],
                ["ward", "Phường / xã", "address-level3"],
                ["addressLine", "Số nhà, tên đường", "street-address"],
              ] as const).map(([field, label, autocomplete]) => (
                <div key={field} className={field === "addressLine" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`address-${field}`} className={labelClass}>{label}</label>
                  <input
                    id={`address-${field}`}
                    className={fieldClass}
                    value={addressDraft[field]}
                    onChange={(event) => setAddressDraft({ ...addressDraft, [field]: event.target.value })}
                    maxLength={field === "addressLine" ? 255 : field === "phone" ? 20 : 100}
                    autoComplete={autocomplete}
                    required
                  />
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-[#342A2A]">
              <input
                type="checkbox"
                checked={addressDraft.isDefault}
                onChange={(event) => setAddressDraft({ ...addressDraft, isDefault: event.target.checked })}
              />
              Đặt làm địa chỉ mặc định
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={savingAddress}
                className="px-5 py-2.5 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#B98C68] disabled:opacity-60 transition"
              >
                {savingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="px-5 py-2.5 rounded-full border border-[#342A2A]/20 text-xs font-semibold uppercase tracking-wider"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
};
