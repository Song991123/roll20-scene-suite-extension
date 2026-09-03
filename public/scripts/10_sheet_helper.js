/*
 * Scene Suite 10 - Sheet Helper 0.6.41
 * 제작 및 통합: @EOOOOORK
 * 시트 HTML 인식: 공개 및 커스텀 시트 호환
 * 속성 변화 알림 참고: https://github.com/kibkibe/roll20-api-scripts/tree/master/attribute_tracker
 */

var KIBScene = KIBScene || {};
var KIBSheetHelper = KIBSheetHelper || {};
var KIBSheetContracts = KIBSheetContracts || [];

/* SCENE_SUITE_SHEET_RECOGNITION_START */
(function () {
  /*!
   * Self-contained Brotli JSON decoder bundle
   *
   * This bundle includes code from brotli.js, base64-js, and the Browserify runtime.
   *
   * MIT License
   *
   * Copyright (c) Devon Govett
   * Copyright (c) 2014 Jameson Little
   * Copyright (c) 2010 James Halliday (mail@substack.net)
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   * Apache License
   * Version 2.0, January 2004
   * http://www.apache.org/licenses/
   *
   * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
   *
   * 1. Definitions.
   *
   * "License" shall mean the terms and conditions for use, reproduction,
   * and distribution as defined by Sections 1 through 9 of this document.
   *
   * "Licensor" shall mean the copyright owner or entity authorized by
   * the copyright owner that is granting the License.
   *
   * "Legal Entity" shall mean the union of the acting entity and all
   * other entities that control, are controlled by, or are under common
   * control with that entity. For the purposes of this definition,
   * "control" means (i) the power, direct or indirect, to cause the
   * direction or management of such entity, whether by contract or
   * otherwise, or (ii) ownership of fifty percent (50%) or more of the
   * outstanding shares, or (iii) beneficial ownership of such entity.
   *
   * "You" (or "Your") shall mean an individual or Legal Entity
   * exercising permissions granted by this License.
   *
   * "Source" form shall mean the preferred form for making modifications,
   * including but not limited to software source code, documentation
   * source, and configuration files.
   *
   * "Object" form shall mean any form resulting from mechanical
   * transformation or translation of a Source form, including but
   * not limited to compiled object code, generated documentation,
   * and conversions to other media types.
   *
   * "Work" shall mean the work of authorship, whether in Source or
   * Object form, made available under the License, as indicated by a
   * copyright notice that is included in or attached to the work
   * (an example is provided in the Appendix below).
   *
   * "Derivative Works" shall mean any work, whether in Source or Object
   * form, that is based on (or derived from) the Work and for which the
   * editorial revisions, annotations, elaborations, or other modifications
   * represent, as a whole, an original work of authorship. For the purposes
   * of this License, Derivative Works shall not include works that remain
   * separable from, or merely link (or bind by name) to the interfaces of,
   * the Work and Derivative Works thereof.
   *
   * "Contribution" shall mean any work of authorship, including
   * the original version of the Work and any modifications or additions
   * to that Work or Derivative Works thereof, that is intentionally
   * submitted to Licensor for inclusion in the Work by the copyright owner
   * or by an individual or Legal Entity authorized to submit on behalf of
   * the copyright owner. For the purposes of this definition, "submitted"
   * means any form of electronic, verbal, or written communication sent
   * to the Licensor or its representatives, including but not limited to
   * communication on electronic mailing lists, source code control systems,
   * and issue tracking systems that are managed by, or on behalf of, the
   * Licensor for the purpose of discussing and improving the Work, but
   * excluding communication that is conspicuously marked or otherwise
   * designated in writing by the copyright owner as "Not a Contribution."
   *
   * "Contributor" shall mean Licensor and any individual or Legal Entity
   * on behalf of whom a Contribution has been received by Licensor and
   * subsequently incorporated within the Work.
   *
   * 2. Grant of Copyright License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * copyright license to reproduce, prepare Derivative Works of,
   * publicly display, publicly perform, sublicense, and distribute the
   * Work and such Derivative Works in Source or Object form.
   *
   * 3. Grant of Patent License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * (except as stated in this section) patent license to make, have made,
   * use, offer to sell, sell, import, and otherwise transfer the Work,
   * where such license applies only to those patent claims licensable
   * by such Contributor that are necessarily infringed by their
   * Contribution(s) alone or by combination of their Contribution(s)
   * with the Work to which such Contribution(s) was submitted. If You
   * institute patent litigation against any entity (including a
   * cross-claim or counterclaim in a lawsuit) alleging that the Work
   * or a Contribution incorporated within the Work constitutes direct
   * or contributory patent infringement, then any patent licenses
   * granted to You under this License for that Work shall terminate
   * as of the date such litigation is filed.
   *
   * 4. Redistribution. You may reproduce and distribute copies of the
   * Work or Derivative Works thereof in any medium, with or without
   * modifications, and in Source or Object form, provided that You
   * meet the following conditions:
   *
   * (a) You must give any other recipients of the Work or
   * Derivative Works a copy of this License; and
   *
   * (b) You must cause any modified files to carry prominent notices
   * stating that You changed the files; and
   *
   * (c) You must retain, in the Source form of any Derivative Works
   * that You distribute, all copyright, patent, trademark, and
   * attribution notices from the Source form of the Work,
   * excluding those notices that do not pertain to any part of
   * the Derivative Works; and
   *
   * (d) If the Work includes a "NOTICE" text file as part of its
   * distribution, then any Derivative Works that You distribute must
   * include a readable copy of the attribution notices contained
   * within such NOTICE file, excluding those notices that do not
   * pertain to any part of the Derivative Works, in at least one
   * of the following places: within a NOTICE text file distributed
   * as part of the Derivative Works; within the Source form or
   * documentation, if provided along with the Derivative Works; or,
   * within a display generated by the Derivative Works, if and
   * wherever such third-party notices normally appear. The contents
   * of the NOTICE file are for informational purposes only and
   * do not modify the License. You may add Your own attribution
   * notices within Derivative Works that You distribute, alongside
   * or as an addendum to the NOTICE text from the Work, provided
   * that such additional attribution notices cannot be construed
   * as modifying the License.
   *
   * You may add Your own copyright statement to Your modifications and
   * may provide additional or different license terms and conditions
   * for use, reproduction, or distribution of Your modifications, or
   * for any such Derivative Works as a whole, provided Your use,
   * reproduction, and distribution of the Work otherwise complies with
   * the conditions stated in this License.
   *
   * 5. Submission of Contributions. Unless You explicitly state otherwise,
   * any Contribution intentionally submitted for inclusion in the Work
   * by You to the Licensor shall be under the terms and conditions of
   * this License, without any additional terms or conditions.
   * Notwithstanding the above, nothing herein shall supersede or modify
   * the terms of any separate license agreement you may have executed
   * with Licensor regarding such Contributions.
   *
   * 6. Trademarks. This License does not grant permission to use the trade
   * names, trademarks, service marks, or product names of the Licensor,
   * except as required for reasonable and customary use in describing the
   * origin of the Work and reproducing the content of the NOTICE file.
   *
   * 7. Disclaimer of Warranty. Unless required by applicable law or
   * agreed to in writing, Licensor provides the Work (and each
   * Contributor provides its Contributions) on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
   * implied, including, without limitation, any warranties or conditions
   * of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
   * PARTICULAR PURPOSE. You are solely responsible for determining the
   * appropriateness of using or redistributing the Work and assume any
   * risks associated with Your exercise of permissions under this License.
   *
   * 8. Limitation of Liability. In no event and under no legal theory,
   * whether in tort (including negligence), contract, or otherwise,
   * unless required by applicable law (such as deliberate and grossly
   * negligent acts) or agreed to in writing, shall any Contributor be
   * liable to You for damages, including any direct, indirect, special,
   * incidental, or consequential damages of any character arising as a
   * result of this License or out of the use or inability to use the
   * Work (including but not limited to damages for loss of goodwill,
   * work stoppage, computer failure or malfunction, or any and all
   * other commercial damages or losses), even if such Contributor
   * has been advised of the possibility of such damages.
   *
   * 9. Accepting Warranty or Additional Liability. While redistributing
   * the Work or Derivative Works thereof, You may choose to offer,
   * and charge a fee for, acceptance of support, warranty, indemnity,
   * or other liability obligations and/or rights consistent with this
   * License. However, in accepting such obligations, You may act only
   * on Your own behalf and on Your sole responsibility, not on behalf
   * of any other Contributor, and only if You agree to indemnify,
   * defend, and hold each Contributor harmless for any liability
   * incurred by, or claims asserted against, such Contributor by reason
   * of your accepting any such warranty or additional liability.
   *
   * END OF TERMS AND CONDITIONS
   *
   * APPENDIX: How to apply the Apache License to your work.
   *
   * To apply the Apache License to your work, attach the following
   * boilerplate notice, with the fields enclosed by brackets "[]"
   * replaced with your own identifying information. (Don't include
   * the brackets!)  The text should be enclosed in the appropriate
   * comment syntax for the file format. We also recommend that a
   * file or class name and description of purpose be included on the
   * same "printed page" as the copyright notice for easier
   * identification within third-party archives.
   *
   * Copyright 2013 Google Inc. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var DecodeBrotliJson = (function () {
    var self = {};
    (function (module, exports, define, window, global) {
      !function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).DecodeBrotliJson=e()}(function(){return function e(n,t,r){function i(s,f){if(!t[s]){if(!n[s]){var a="function"==typeof require&&require;if(!f&&a)return a(s,!0);if(o)return o(s,!0);var w=new Error("Cannot find module '"+s+"'");throw w.code="MODULE_NOT_FOUND",w}var d=t[s]={exports:{}};n[s][0].call(d.exports,function(e){return i(n[s][1][e]||e)},d,d.exports,e,n,t,r)}return t[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,n,t){var r=e("brotli/decompress"),i=e("base64-js").toByteArray;n.exports=function(e){for(var n=r(i(e)),t=[],o=[],s=0;s<n.length;s+=1)o.push(n[s]),8192===o.length&&(t.push(String.fromCharCode.apply(null,o)),o.length=0);return o.length&&t.push(String.fromCharCode.apply(null,o)),t.join("")}},{"base64-js":2,"brotli/decompress":13}],2:[function(e,n,t){"use strict";t.byteLength=function(e){var n=a(e),t=n[0],r=n[1];return 3*(t+r)/4-r},t.toByteArray=function(e){var n,t,r=a(e),s=r[0],f=r[1],w=new o(function(e,n,t){return 3*(n+t)/4-t}(0,s,f)),d=0,u=f>0?s-4:s;for(t=0;t<u;t+=4)n=i[e.charCodeAt(t)]<<18|i[e.charCodeAt(t+1)]<<12|i[e.charCodeAt(t+2)]<<6|i[e.charCodeAt(t+3)],w[d++]=n>>16&255,w[d++]=n>>8&255,w[d++]=255&n;return 2===f&&(n=i[e.charCodeAt(t)]<<2|i[e.charCodeAt(t+1)]>>4,w[d++]=255&n),1===f&&(n=i[e.charCodeAt(t)]<<10|i[e.charCodeAt(t+1)]<<4|i[e.charCodeAt(t+2)]>>2,w[d++]=n>>8&255,w[d++]=255&n),w},t.fromByteArray=function(e){for(var n,t=e.length,i=t%3,o=[],s=16383,f=0,a=t-i;f<a;f+=s)o.push(d(e,f,f+s>a?a:f+s));return 1===i?(n=e[t-1],o.push(r[n>>2]+r[n<<4&63]+"==")):2===i&&(n=(e[t-2]<<8)+e[t-1],o.push(r[n>>10]+r[n>>4&63]+r[n<<2&63]+"=")),o.join("")};for(var r=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)r[f]=s[f],i[s.charCodeAt(f)]=f;function a(e){var n=e.length;if(n%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var t=e.indexOf("=");return-1===t&&(t=n),[t,t===n?0:4-t%4]}function w(e){return r[e>>18&63]+r[e>>12&63]+r[e>>6&63]+r[63&e]}function d(e,n,t){for(var r,i=[],o=n;o<t;o+=3)r=(e[o]<<16&16711680)+(e[o+1]<<8&65280)+(255&e[o+2]),i.push(w(r));return i.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},{}],3:[function(e,n,t){var r=4096,i=new Uint32Array([0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215]);function o(e){this.buf_=new Uint8Array(8224),this.input_=e,this.reset()}o.READ_SIZE=r,o.IBUF_MASK=8191,o.prototype.reset=function(){this.buf_ptr_=0,this.val_=0,this.pos_=0,this.bit_pos_=0,this.bit_end_pos_=0,this.eos_=0,this.readMoreInput();for(var e=0;e<4;e++)this.val_|=this.buf_[this.pos_]<<8*e,++this.pos_;return this.bit_end_pos_>0},o.prototype.readMoreInput=function(){if(!(this.bit_end_pos_>256))if(this.eos_){if(this.bit_pos_>this.bit_end_pos_)throw new Error("Unexpected end of input "+this.bit_pos_+" "+this.bit_end_pos_)}else{var e=this.buf_ptr_,n=this.input_.read(this.buf_,e,r);if(n<0)throw new Error("Unexpected end of input");if(n<r){this.eos_=1;for(var t=0;t<32;t++)this.buf_[e+n+t]=0}if(0===e){for(t=0;t<32;t++)this.buf_[8192+t]=this.buf_[t];this.buf_ptr_=r}else this.buf_ptr_=0;this.bit_end_pos_+=n<<3}},o.prototype.fillBitWindow=function(){for(;this.bit_pos_>=8;)this.val_>>>=8,this.val_|=this.buf_[8191&this.pos_]<<24,++this.pos_,this.bit_pos_=this.bit_pos_-8>>>0,this.bit_end_pos_=this.bit_end_pos_-8>>>0},o.prototype.readBits=function(e){32-this.bit_pos_<e&&this.fillBitWindow();var n=this.val_>>>this.bit_pos_&i[e];return this.bit_pos_+=e,n},n.exports=o},{}],4:[function(e,n,t){t.lookup=new Uint8Array([0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,56,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),t.lookupOffsets=new Uint16Array([1024,1536,1280,1536,0,256,768,512])},{}],5:[function(e,n,t){var r=e("./streams").BrotliInput,i=e("./streams").BrotliOutput,o=e("./bit_reader"),s=e("./dictionary"),f=e("./huffman").HuffmanCode,a=e("./huffman").BrotliBuildHuffmanTable,w=e("./context"),d=e("./prefix"),u=e("./transform"),p=1080,h=new Uint8Array([1,2,3,4,0,5,17,6,16,7,8,9,10,11,12,13,14,15]),c=new Uint8Array([3,2,1,0,3,3,3,3,3,3,2,2,2,2,2,2]),b=new Int8Array([0,0,0,0,-1,1,-2,2,-3,3,-1,1,-2,2,-3,3]),l=new Uint16Array([256,402,436,468,500,534,566,598,630,662,694,726,758,790,822,854,886,920,952,984,1016,1048,1080]);function v(e){var n;return 0===e.readBits(1)?16:(n=e.readBits(3))>0?17+n:(n=e.readBits(3))>0?8+n:17}function y(e){if(e.readBits(1)){var n=e.readBits(3);return 0===n?1:e.readBits(n)+(1<<n)}return 0}function m(){this.meta_block_length=0,this.input_end=0,this.is_uncompressed=0,this.is_metadata=!1}function W(e){var n,t,r,i=new m;if(i.input_end=e.readBits(1),i.input_end&&e.readBits(1))return i;if(7===(n=e.readBits(2)+4)){if(i.is_metadata=!0,0!==e.readBits(1))throw new Error("Invalid reserved bit");if(0===(t=e.readBits(2)))return i;for(r=0;r<t;r++){var o=e.readBits(8);if(r+1===t&&t>1&&0===o)throw new Error("Invalid size byte");i.meta_block_length|=o<<8*r}}else for(r=0;r<n;++r){var s=e.readBits(4);if(r+1===n&&n>4&&0===s)throw new Error("Invalid size nibble");i.meta_block_length|=s<<4*r}return++i.meta_block_length,i.input_end||i.is_metadata||(i.is_uncompressed=e.readBits(1)),i}function x(e,n,t){var r;return t.fillBitWindow(),(r=e[n+=t.val_>>>t.bit_pos_&255].bits-8)>0&&(t.bit_pos_+=8,n+=e[n].value,n+=t.val_>>>t.bit_pos_&(1<<r)-1),t.bit_pos_+=e[n].bits,e[n].value}function U(e,n,t,r){var i,o,s=new Uint8Array(e);if(r.readMoreInput(),1===(o=r.readBits(2))){for(var w=e-1,d=0,u=new Int32Array(4),p=r.readBits(2)+1;w;)w>>=1,++d;for(c=0;c<p;++c)u[c]=r.readBits(d)%e,s[u[c]]=2;switch(s[u[0]]=1,p){case 1:break;case 3:if(u[0]===u[1]||u[0]===u[2]||u[1]===u[2])throw new Error("[ReadHuffmanCode] invalid symbols");break;case 2:if(u[0]===u[1])throw new Error("[ReadHuffmanCode] invalid symbols");s[u[1]]=1;break;case 4:if(u[0]===u[1]||u[0]===u[2]||u[0]===u[3]||u[1]===u[2]||u[1]===u[3]||u[2]===u[3])throw new Error("[ReadHuffmanCode] invalid symbols");r.readBits(1)?(s[u[2]]=3,s[u[3]]=3):s[u[0]]=2}}else{var c,b=new Uint8Array(18),l=32,v=0,y=[new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,1),new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,5)];for(c=o;c<18&&l>0;++c){var m,W=h[c],x=0;r.fillBitWindow(),x+=r.val_>>>r.bit_pos_&15,r.bit_pos_+=y[x].bits,m=y[x].value,b[W]=m,0!==m&&(l-=32>>m,++v)}if(1!==v&&0!==l)throw new Error("[ReadHuffmanCode] invalid num_codes or space");!function(e,n,t,r){for(var i=0,o=8,s=0,w=0,d=32768,u=[],p=0;p<32;p++)u.push(new f(0,0));for(a(u,0,5,e,18);i<n&&d>0;){var h,c=0;if(r.readMoreInput(),r.fillBitWindow(),c+=r.val_>>>r.bit_pos_&31,r.bit_pos_+=u[c].bits,(h=255&u[c].value)<16)s=0,t[i++]=h,0!==h&&(o=h,d-=32768>>h);else{var b,l,v=h-14,y=0;if(16===h&&(y=o),w!==y&&(s=0,w=y),b=s,s>0&&(s-=2,s<<=v),i+(l=(s+=r.readBits(v)+3)-b)>n)throw new Error("[ReadHuffmanCodeLengths] symbol + repeat_delta > num_symbols");for(var m=0;m<l;m++)t[i+m]=w;i+=l,0!==w&&(d-=l<<15-w)}}if(0!==d)throw new Error("[ReadHuffmanCodeLengths] space = "+d);for(;i<n;i++)t[i]=0}(b,e,s,r)}if(0===(i=a(n,t,8,s,e)))throw new Error("[ReadHuffmanCode] BuildHuffmanTable failed: ");return i}function E(e,n,t){var r,i;return r=x(e,n,t),i=d.kBlockLengthPrefixCode[r].nbits,d.kBlockLengthPrefixCode[r].offset+t.readBits(i)}function V(e,n,t){var r;return e<16?(t+=c[e],r=n[t&=3]+b[e]):r=e-16+1,r}function O(e,n){for(var t=e[n],r=n;r;--r)e[r]=e[r-1];e[0]=t}function N(e,n){this.alphabet_size=e,this.num_htrees=n,this.codes=new Array(n+n*l[e+31>>>5]),this.htrees=new Uint32Array(n)}function q(e,n){var t,r,i={num_htrees:null,context_map:null},o=0;n.readMoreInput();var s=i.num_htrees=y(n)+1,a=i.context_map=new Uint8Array(e);if(s<=1)return i;for(n.readBits(1)&&(o=n.readBits(4)+1),t=[],r=0;r<p;r++)t[r]=new f(0,0);for(U(s+o,t,0,n),r=0;r<e;){var w;if(n.readMoreInput(),0===(w=x(t,0,n)))a[r]=0,++r;else if(w<=o)for(var d=1+(1<<w)+n.readBits(w);--d;){if(r>=e)throw new Error("[DecodeContextMap] i >= context_map_size");a[r]=0,++r}else a[r]=w-o,++r}return n.readBits(1)&&function(e,n){var t,r=new Uint8Array(256);for(t=0;t<256;++t)r[t]=t;for(t=0;t<n;++t){var i=e[t];e[t]=r[i],i&&O(r,i)}}(a,e),i}function B(e,n,t,r,i,o,s){var f,a=2*t,w=t,d=x(n,t*p,s);(f=0===d?i[a+(1&o[w])]:1===d?i[a+(o[w]-1&1)]+1:d-2)>=e&&(f-=e),r[t]=f,i[a+(1&o[w])]=f,++o[w]}function Y(e,n,t,r,i,s){var f,a=i+1,w=t&i,d=s.pos_&o.IBUF_MASK;if(n<8||s.bit_pos_+(n<<3)<s.bit_end_pos_)for(;n-- >0;)s.readMoreInput(),r[w++]=s.readBits(8),w===a&&(e.write(r,a),w=0);else{if(s.bit_end_pos_<32)throw new Error("[CopyUncompressedBlockToOutput] br.bit_end_pos_ < 32");for(;s.bit_pos_<32;)r[w]=s.val_>>>s.bit_pos_,s.bit_pos_+=8,++w,--n;if(d+(f=s.bit_end_pos_-s.bit_pos_>>3)>o.IBUF_MASK){for(var u=o.IBUF_MASK+1-d,p=0;p<u;p++)r[w+p]=s.buf_[d+p];f-=u,w+=u,n-=u,d=0}for(p=0;p<f;p++)r[w+p]=s.buf_[d+p];if(n-=f,(w+=f)>=a)for(e.write(r,a),w-=a,p=0;p<w;p++)r[p]=r[a+p];for(;w+n>=a;){if(f=a-w,s.input_.read(r,w,f)<f)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");e.write(r,a),n-=f,w=0}if(s.input_.read(r,w,n)<n)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");s.reset()}}function R(e){var n=e.bit_pos_+7&-8;return 0==e.readBits(n-e.bit_pos_)}function H(e){var n=new r(e),t=new o(n);return v(t),W(t).meta_block_length}function M(e,n){var t,r,i,a,h,c,b,l,m,O,H=0,M=0,g=0,A=[16,15,11,4],F=0,Z=0,P=0,k=[new N(0,0),new N(0,0),new N(0,0)],K=128+o.READ_SIZE;i=(1<<(r=v(O=new o(e))))-16,h=(a=1<<r)-1,c=new Uint8Array(a+K+s.maxDictionaryWordLength),b=a,l=[],m=[];for(var X=0;X<3240;X++)l[X]=new f(0,0),m[X]=new f(0,0);for(;!M;){var G,L,J,T,z,D,I,j,C,Q,S,_=0,$=[1<<28,1<<28,1<<28],ee=[0],ne=[1,1,1],te=[0,1,0,1,0,1],re=[0],ie=null,oe=null,se=0,fe=null,ae=0,we=0,de=0;for(t=0;t<3;++t)k[t].codes=null,k[t].htrees=null;O.readMoreInput();var ue=W(O);if(H+(_=ue.meta_block_length)>n.buffer.length){var pe=new Uint8Array(H+_);pe.set(n.buffer),n.buffer=pe}if(M=ue.input_end,G=ue.is_uncompressed,ue.is_metadata)for(R(O);_>0;--_)O.readMoreInput(),O.readBits(8);else if(0!==_)if(G)O.bit_pos_=O.bit_pos_+7&-8,Y(n,_,H,c,h,O),H+=_;else{for(t=0;t<3;++t)ne[t]=y(O)+1,ne[t]>=2&&(U(ne[t]+2,l,t*p,O),U(26,m,t*p,O),$[t]=E(m,t*p,O),re[t]=1);for(O.readMoreInput(),T=(1<<(L=O.readBits(2)))-1,z=(J=16+(O.readBits(4)<<L))+(48<<L),ie=new Uint8Array(ne[0]),t=0;t<ne[0];++t)O.readMoreInput(),ie[t]=O.readBits(2)<<1;var he=q(ne[0]<<6,O);I=he.num_htrees,D=he.context_map;var ce=q(ne[2]<<2,O);for(C=ce.num_htrees,j=ce.context_map,k[0]=new N(256,I),k[1]=new N(704,ne[1]),k[2]=new N(z,C),t=0;t<3;++t)k[t].decode(O);for(oe=0,fe=0,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1],S=k[1].htrees[0];_>0;){var be,le,ve,ye,me,We,xe,Ue,Ee,Ve,Oe,Ne;for(O.readMoreInput(),0===$[1]&&(B(ne[1],l,1,ee,te,re,O),$[1]=E(m,p,O),S=k[1].htrees[ee[1]]),--$[1],(le=(be=x(k[1].codes,S,O))>>6)>=2?(le-=2,xe=-1):xe=0,ve=d.kInsertRangeLut[le]+(be>>3&7),ye=d.kCopyRangeLut[le]+(7&be),me=d.kInsertLengthPrefixCode[ve].offset+O.readBits(d.kInsertLengthPrefixCode[ve].nbits),We=d.kCopyLengthPrefixCode[ye].offset+O.readBits(d.kCopyLengthPrefixCode[ye].nbits),Z=c[H-1&h],P=c[H-2&h],Ee=0;Ee<me;++Ee)O.readMoreInput(),0===$[0]&&(B(ne[0],l,0,ee,te,re,O),$[0]=E(m,0,O),oe=ee[0]<<6,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1]),se=D[oe+(w.lookup[we+Z]|w.lookup[de+P])],--$[0],P=Z,Z=x(k[0].codes,k[0].htrees[se],O),c[H&h]=Z,(H&h)===h&&n.write(c,a),++H;if((_-=me)<=0)break;if(xe<0&&(O.readMoreInput(),0===$[2]&&(B(ne[2],l,2,ee,te,re,O),$[2]=E(m,2160,O),fe=ee[2]<<2),--$[2],ae=j[fe+(255&(We>4?3:We-2))],(xe=x(k[2].codes,k[2].htrees[ae],O))>=J&&(Ne=(xe-=J)&T,xe=J+((qe=(2+(1&(xe>>=L))<<(Oe=1+(xe>>1)))-4)+O.readBits(Oe)<<L)+Ne)),(Ue=V(xe,A,F))<0)throw new Error("[BrotliDecompress] invalid distance");if(Ve=H&h,Ue>(g=H<i&&g!==i?H:i)){if(!(We>=s.minDictionaryWordLength&&We<=s.maxDictionaryWordLength))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var qe=s.offsetsByLength[We],Be=Ue-g-1,Ye=s.sizeBitsByLength[We],Re=Be>>Ye;if(qe+=(Be&(1<<Ye)-1)*We,!(Re<u.kNumTransforms))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var He=u.transformDictionaryWord(c,Ve,qe,We,Re);if(H+=He,_-=He,(Ve+=He)>=b){n.write(c,a);for(var Me=0;Me<Ve-b;Me++)c[Me]=c[b+Me]}}else{if(xe>0&&(A[3&F]=Ue,++F),We>_)throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);for(Ee=0;Ee<We;++Ee)c[H&h]=c[H-Ue&h],(H&h)===h&&n.write(c,a),++H,--_}Z=c[H-1&h],P=c[H-2&h]}H&=1073741823}}n.write(c,H&h)}N.prototype.decode=function(e){var n,t=0;for(n=0;n<this.num_htrees;++n)this.htrees[n]=t,t+=U(this.alphabet_size,this.codes,t,e)},t.BrotliDecompressedSize=H,t.BrotliDecompressBuffer=function(e,n){var t=new r(e);null==n&&(n=H(e));var o=new Uint8Array(n),s=new i(o);return M(t,s),s.pos<s.buffer.length&&(s.buffer=s.buffer.subarray(0,s.pos)),s.buffer},t.BrotliDecompress=M,s.init()},{"./bit_reader":3,"./context":4,"./dictionary":8,"./huffman":9,"./prefix":10,"./streams":11,"./transform":12}],6:[function(e,n,t){var r=e("base64-js");t.init=function(){return(0,e("./decode").BrotliDecompressBuffer)(r.toByteArray(e("./dictionary.bin.js")))}},{"./decode":5,"./dictionary.bin.js":7,"base64-js":2}],7:[function(e,n,t){n.exports="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"},{}],8:[function(e,n,t){var r=e("./dictionary-data");t.init=function(){t.dictionary=r.init()},t.offsetsByLength=new Uint32Array([0,0,0,0,0,4096,9216,21504,35840,44032,53248,63488,74752,87040,93696,100864,104704,106752,108928,113536,115968,118528,119872,121280,122016]),t.sizeBitsByLength=new Uint8Array([0,0,0,0,10,10,11,11,10,10,10,10,10,9,9,8,7,7,8,7,7,6,6,5,5]),t.minDictionaryWordLength=4,t.maxDictionaryWordLength=24},{"./dictionary-data":6}],9:[function(e,n,t){function r(e,n){this.bits=e,this.value=n}t.HuffmanCode=r;function i(e,n){for(var t=1<<n-1;e&t;)t>>=1;return(e&t-1)+t}function o(e,n,t,i,o){do{e[n+(i-=t)]=new r(o.bits,o.value)}while(i>0)}function s(e,n,t){for(var r=1<<n-t;n<15&&!((r-=e[n])<=0);)++n,r<<=1;return n-t}t.BrotliBuildHuffmanTable=function(e,n,t,f,a){var w,d,u,p,h,c,b,l,v,y,m=n,W=new Int32Array(16),x=new Int32Array(16);for(y=new Int32Array(a),d=0;d<a;d++)W[f[d]]++;for(x[1]=0,w=1;w<15;w++)x[w+1]=x[w]+W[w];for(d=0;d<a;d++)0!==f[d]&&(y[x[f[d]]++]=d);if(v=l=1<<(b=t),1===x[15]){for(u=0;u<v;++u)e[n+u]=new r(0,65535&y[0]);return v}for(u=0,d=0,w=1,p=2;w<=t;++w,p<<=1)for(;W[w]>0;--W[w])o(e,n+u,p,l,new r(255&w,65535&y[d++])),u=i(u,w);for(c=v-1,h=-1,w=t+1,p=2;w<=15;++w,p<<=1)for(;W[w]>0;--W[w])(u&c)!==h&&(n+=l,v+=l=1<<(b=s(W,w,t)),e[m+(h=u&c)]=new r(b+t&255,n-m-h&65535)),o(e,n+(u>>t),p,l,new r(w-t&255,65535&y[d++])),u=i(u,w);return v}},{}],10:[function(e,n,t){function r(e,n){this.offset=e,this.nbits=n}t.kBlockLengthPrefixCode=[new r(1,2),new r(5,2),new r(9,2),new r(13,2),new r(17,3),new r(25,3),new r(33,3),new r(41,3),new r(49,4),new r(65,4),new r(81,4),new r(97,4),new r(113,5),new r(145,5),new r(177,5),new r(209,5),new r(241,6),new r(305,6),new r(369,7),new r(497,8),new r(753,9),new r(1265,10),new r(2289,11),new r(4337,12),new r(8433,13),new r(16625,24)],t.kInsertLengthPrefixCode=[new r(0,0),new r(1,0),new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,1),new r(8,1),new r(10,2),new r(14,2),new r(18,3),new r(26,3),new r(34,4),new r(50,4),new r(66,5),new r(98,5),new r(130,6),new r(194,7),new r(322,8),new r(578,9),new r(1090,10),new r(2114,12),new r(6210,14),new r(22594,24)],t.kCopyLengthPrefixCode=[new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,0),new r(7,0),new r(8,0),new r(9,0),new r(10,1),new r(12,1),new r(14,2),new r(18,2),new r(22,3),new r(30,3),new r(38,4),new r(54,4),new r(70,5),new r(102,5),new r(134,6),new r(198,7),new r(326,8),new r(582,9),new r(1094,10),new r(2118,24)],t.kInsertRangeLut=[0,0,8,8,0,16,8,16,16],t.kCopyRangeLut=[0,8,0,8,16,0,16,8,16]},{}],11:[function(e,n,t){function r(e){this.buffer=e,this.pos=0}function i(e){this.buffer=e,this.pos=0}r.prototype.read=function(e,n,t){this.pos+t>this.buffer.length&&(t=this.buffer.length-this.pos);for(var r=0;r<t;r++)e[n+r]=this.buffer[this.pos+r];return this.pos+=t,t},t.BrotliInput=r,i.prototype.write=function(e,n){if(this.pos+n>this.buffer.length)throw new Error("Output buffer is not large enough");return this.buffer.set(e.subarray(0,n),this.pos),this.pos+=n,n},t.BrotliOutput=i},{}],12:[function(e,n,t){var r=e("./dictionary"),i=10,o=11;function s(e,n,t){this.prefix=new Uint8Array(e.length),this.transform=n,this.suffix=new Uint8Array(t.length);for(var r=0;r<e.length;r++)this.prefix[r]=e.charCodeAt(r);for(r=0;r<t.length;r++)this.suffix[r]=t.charCodeAt(r)}var f=[new s("",0,""),new s("",0," "),new s(" ",0," "),new s("",12,""),new s("",i," "),new s("",0," the "),new s(" ",0,""),new s("s ",0," "),new s("",0," of "),new s("",i,""),new s("",0," and "),new s("",13,""),new s("",1,""),new s(", ",0," "),new s("",0,", "),new s(" ",i," "),new s("",0," in "),new s("",0," to "),new s("e ",0," "),new s("",0,'"'),new s("",0,"."),new s("",0,'">'),new s("",0,"\n"),new s("",3,""),new s("",0,"]"),new s("",0," for "),new s("",14,""),new s("",2,""),new s("",0," a "),new s("",0," that "),new s(" ",i,""),new s("",0,". "),new s(".",0,""),new s(" ",0,", "),new s("",15,""),new s("",0," with "),new s("",0,"'"),new s("",0," from "),new s("",0," by "),new s("",16,""),new s("",17,""),new s(" the ",0,""),new s("",4,""),new s("",0,". The "),new s("",o,""),new s("",0," on "),new s("",0," as "),new s("",0," is "),new s("",7,""),new s("",1,"ing "),new s("",0,"\n\t"),new s("",0,":"),new s(" ",0,". "),new s("",0,"ed "),new s("",20,""),new s("",18,""),new s("",6,""),new s("",0,"("),new s("",i,", "),new s("",8,""),new s("",0," at "),new s("",0,"ly "),new s(" the ",0," of "),new s("",5,""),new s("",9,""),new s(" ",i,", "),new s("",i,'"'),new s(".",0,"("),new s("",o," "),new s("",i,'">'),new s("",0,'="'),new s(" ",0,"."),new s(".com/",0,""),new s(" the ",0," of the "),new s("",i,"'"),new s("",0,". This "),new s("",0,","),new s(".",0," "),new s("",i,"("),new s("",i,"."),new s("",0," not "),new s(" ",0,'="'),new s("",0,"er "),new s(" ",o," "),new s("",0,"al "),new s(" ",o,""),new s("",0,"='"),new s("",o,'"'),new s("",i,". "),new s(" ",0,"("),new s("",0,"ful "),new s(" ",i,". "),new s("",0,"ive "),new s("",0,"less "),new s("",o,"'"),new s("",0,"est "),new s(" ",i,"."),new s("",o,'">'),new s(" ",0,"='"),new s("",i,","),new s("",0,"ize "),new s("",o,"."),new s("Â ",0,""),new s(" ",0,","),new s("",i,'="'),new s("",o,'="'),new s("",0,"ous "),new s("",o,", "),new s("",i,"='"),new s(" ",i,","),new s(" ",o,'="'),new s(" ",o,", "),new s("",o,","),new s("",o,"("),new s("",o,". "),new s(" ",o,"."),new s("",o,"='"),new s(" ",o,". "),new s(" ",i,'="'),new s(" ",o,"='"),new s(" ",i,"='")];function a(e,n){return e[n]<192?(e[n]>=97&&e[n]<=122&&(e[n]^=32),1):e[n]<224?(e[n+1]^=32,2):(e[n+2]^=5,3)}t.kTransforms=f,t.kNumTransforms=f.length,t.transformDictionaryWord=function(e,n,t,s,w){var d,u=f[w].prefix,p=f[w].suffix,h=f[w].transform,c=h<12?0:h-11,b=0,l=n;c>s&&(c=s);for(var v=0;v<u.length;)e[n++]=u[v++];for(t+=c,s-=c,h<=9&&(s-=h),b=0;b<s;b++)e[n++]=r.dictionary[t+b];if(d=n-s,h===i)a(e,d);else if(h===o)for(;s>0;){var y=a(e,d);d+=y,s-=y}for(var m=0;m<p.length;)e[n++]=p[m++];return n-l}},{"./dictionary":8}],13:[function(e,n,t){n.exports=e("./dec/decode").BrotliDecompressBuffer},{"./dec/decode":5}]},{},[1])(1)});
    }(void 0, void 0, void 0, void 0, void 0));
    return self.DecodeBrotliJson;
  }());
  var compressed = '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';
  if (compressed.length !== 300680 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4758970) throw new Error('Invalid embedded sheet data length.');
  var bundle = JSON.parse(decoded);
  var strings = bundle.d || [];
  function expand(value) {
    if (typeof value === 'string' && value.charAt(0) === '')
      return strings[parseInt(value.substring(1), 36)];
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { value[index] = expand(item); });
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) { value[key] = expand(value[key]); });
    }
    return value;
  }
  var packed = expand(bundle.p || bundle);
  var embedded = packed.s || [];
  var sharedModeSets = packed.m || [];
  var serializedModes = sharedModeSets.map(JSON.stringify);
  var serializedRollVisibility = (packed.r || []).map(JSON.stringify);
  var serializedFieldVisibility = (packed.v || []).map(JSON.stringify);
  var serializedFieldAliases = (packed.a || []).map(JSON.stringify);
  embedded.forEach(function (sheet) {
    var modeSets = (sheet.M || []).map(function (index) { return serializedModes[index]; });
    var rollVisibilitySets = (sheet.R || []).map(function (index) { return JSON.parse(serializedRollVisibility[index]); });
    sheet.rolls = (sheet.rolls || []).map(function (roll) {
      var restored = { key: roll[0], name: roll[1] || null, label: roll[2] || '', aliases: roll[3] || [],
        raw: roll[4] || '', template: roll[5] || null, repeating: roll[7] || null,
        staticLabels: roll[8] || [], labelRefs: roll[9] || [], expressionRefs: roll[10] || [],
        modes: roll[13] ? JSON.parse(modeSets[roll[13] - 1]) : [] };
      if (roll[6]) restored.refs = roll[6];
      if (roll[11]) restored.controls = roll[11];
      if (roll[12]) restored.modesIncomplete = true;
      if (roll[14]) restored.visibility = rollVisibilitySets[roll[14] - 1];
      return restored;
    });
    delete sheet.M;
    delete sheet.R;
    var fieldVisibilitySets = (sheet.V || []).map(function (index) { return JSON.parse(serializedFieldVisibility[index]); });
    var fieldAliasSets = (sheet.A || []).map(function (index) { return JSON.parse(serializedFieldAliases[index]); });
    delete sheet.V;
    delete sheet.A;
    var fieldTypes = ['text','number','range','checkbox','radio','hidden','textarea','select'];
    var sections = Object.keys(sheet.sections || {}).sort();
    var repeatingFields = Object.create(null);
    sections.forEach(function (section) {
      (sheet.sections[section] || []).forEach(function (name) { repeatingFields[name] = true; });
    });
    var globalRepeating = sheet.g || [];
    sheet.globalAttributes = (sheet.attributes || []).filter(function (name) {
      return !repeatingFields[name] || globalRepeating.indexOf(name) >= 0;
    });
    delete sheet.g;
    sheet.fields = (sheet.f || []).map(function (field) {
      var flags = Number(field[3]) || 0;
      var restored = { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',
        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],
        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',
        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),
        disabled: !!(flags & 8), hidden: !!(flags & 16) };
      if (field[11]) restored.defaultVariants = [restored.default].concat(field[11]);
      if (field[12]) restored.radioRange = field[12].slice();
      return restored;
    });
    delete sheet.f;
    if (!KIBSheetContracts.some(function (current) { return current && current.id === sheet.id; }))
      KIBSheetContracts.push(sheet);
  });
}());
/* SCENE_SUITE_SHEET_RECOGNITION_END */

// ===== 사용자 설정 =====
var sheet_helper_setting = {
  enabled: true,
  legacy_commands: true,
  manager_name: '[GM] 시트 헬퍼 관리',
  player_help_name: '[PL] 시트 헬퍼 사용법',
  refresh_delay: 700,
};

(function (api) {
  'use strict';

  var SHEET_NOT_RECOGNIZED = '현재 인식된 시트가 없습니다.';

  var VERSION = '0.6.41';
  var cache = {};
  var attributeObjectCache = {};
  var refreshTimer = null;
  var pendingResults = {};
  var contractIndexCache = {};
  var contractMatchCache = {};
  var contractCatalogCache = null;
  var suppressedAttributeChanges = {};
  var pendingAttributeChanges = {};
  var pendingAttributeOrder = [];
  var attributeChangeTimer = null;

  function own(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function dictionary(source) {
    var result = Object.create(null);
    Object.keys(source || {}).forEach(function (key) { result[key] = source[key]; });
    return result;
  }

  function trim(value) {
    return String(value == null ? '' : value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

 function normalize(value) {
    return trim(value)
      .toLowerCase()
      .replace(/[\s_()（）\[\]{}\/\\.\u00b7,:：-]+/g, '');
  }

  function arithmeticValue(expression) {
    var source = trim(expression).replace(/\s+/g, '');
    var tokens = source.match(/floor|ceil|round|min|max|abs|\d+(?:\.\d+)?|[()+\-*/,]/gi) || [];
    if (!source || tokens.join('') !== source || tokens.length > 200) return null;
    var at = 0;
    function primary() {
      var token = tokens[at++];
      if (token === '+' || token === '-') {
        var unary = primary();
        return unary === null ? null : token === '-' ? -unary : unary;
      }
      if (token === '(') {
        var nested = expressionValue();
        if (tokens[at++] !== ')') return null;
        return nested;
      }
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token || '')) {
        var name = token.toLowerCase();
        if (tokens[at++] !== '(') return null;
        var args = [expressionValue()];
        while (tokens[at] === ',') { at += 1; args.push(expressionValue()); }
        if (tokens[at++] !== ')' || args.some(function (value) { return value === null; })) return null;
        if ((name === 'min' || name === 'max') && args.length)
          return Math[name].apply(Math, args);
        if (args.length !== 1) return null;
        return Math[name](args[0]);
      }
      return /^\d+(?:\.\d+)?$/.test(token || '') ? Number(token) : null;
    }
    function term() {
      var value = primary();
      while (value !== null && (tokens[at] === '*' || tokens[at] === '/')) {
        var op = tokens[at++];
        var right = primary();
        if (right === null || (op === '/' && right === 0)) return null;
        value = op === '*' ? value * right : value / right;
      }
      return value;
    }
    function expressionValue() {
      var value = term();
      while (value !== null && (tokens[at] === '+' || tokens[at] === '-')) {
        var op = tokens[at++];
        var right = term();
        if (right === null) return null;
        value = op === '+' ? value + right : value - right;
      }
      return value;
    }
    var result = expressionValue();
    return at === tokens.length && result !== null && isFinite(result) ? result : null;
  }

  function resolvedResourceValue(characterId, raw, defaults, rowContext) {
    var source = trim(raw);
    if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(source)) {
      var direct = Number(source);
      return { number: direct, text: String(direct) };
    }
    var resolved = resolvedRollExpression(characterId, source,
      rowContext && rowContext.scopes || [], 0, {}, defaults, rowContext);
    if (!resolved)
      return { number: null, text: source.indexOf('@{') > -1 ? '확인 필요' : source };
    if (!/(?:^|[^A-Za-z0-9_])(?:\d*)d\d+(?:[^A-Za-z0-9_]|$)/i.test(resolved)) {
      if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(resolved)) {
        var numeric = Number(resolved);
        return { number: numeric, text: String(numeric) };
      }
      var calculated = arithmeticValue(resolved);
      if (calculated !== null) {
        calculated = Math.round(calculated * 100) / 100;
        return { number: calculated, text: String(calculated) };
      }
    }
    return { number: null, text: resolved.indexOf('@{') > -1 ? '확인 필요' : resolved };
  }

  function getAttr(characterId, name, valueType) {
    if (!characterId || !name) return undefined;
    try {
      return getAttrByName(characterId, name, valueType || 'current');
    } catch (err) {
      return undefined;
    }
  }

  function cachedAttrReader(characterId) {
    var values = dictionary();
    return function (name, type) {
      var key = trim(name) + '|' + (type || 'current');
      if (!own(values, key)) values[key] = getAttr(characterId, name, type);
      return values[key];
    };
  }

  function attrObjects(characterId) {
    return (
      findObjs({ _type: 'attribute', _characterid: characterId }) ||
      findObjs({ type: 'attribute', characterid: characterId }) ||
      []
    );
  }

  function characterObjects() {
    return (findObjs({ _type: 'character' }) || findObjs({ type: 'character' }) || [])
      .slice()
      .sort(function (a, b) {
        return trim(a.get('name')).localeCompare(trim(b.get('name')));
      });
  }

  function initState() {
    state.KIBSheetHelper = state.KIBSheetHelper || {};
    var data = state.KIBSheetHelper;
    if (typeof data.managerId !== 'string') data.managerId = '';
    if (typeof data.managerCharacterId !== 'string') data.managerCharacterId = '';
    if (typeof data.managerHash !== 'string') data.managerHash = '';
    if (typeof data.playerHelpId !== 'string') data.playerHelpId = '';
    if (typeof data.playerHelpHash !== 'string') data.playerHelpHash = '';
    if (!/^(?:public|gm|off)$/.test(data.trackingMode || ''))
      data.trackingMode = own(state, 'hide_tracking') && typeof state.hide_tracking === 'boolean'
        ? state.hide_tracking ? 'gm' : 'public'
        : 'gm';
    if (typeof data.trackGmOnly !== 'boolean') data.trackGmOnly = false;
    data.version = VERSION;
    return data;
  }

  function collectRows(characterId, section, fields, objects, knownPrefixes) {
    var prefix = 'repeating_' + section + '_';
    var attributes = objects || attrObjects(characterId);
    var prefixes = Array.isArray(knownPrefixes) ? knownPrefixes.slice().sort(function (left, right) {
      return right.length - left.length;
    }) : null;
    var sortedFields = fields.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    var rows = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name.indexOf(prefix) !== 0) return;
      if (prefixes) {
        var matchedPrefix = '';
        for (var p = 0; p < prefixes.length; p++) {
          if (name.indexOf(prefixes[p]) === 0) { matchedPrefix = prefixes[p]; break; }
        }
        if (matchedPrefix && matchedPrefix !== prefix) return;
      }
      for (var i = 0; i < sortedFields.length; i++) {
        var field = sortedFields[i];
        var suffix = '_' + field;
        if (name.length <= prefix.length + suffix.length) continue;
        if (name.substring(name.length - suffix.length) !== suffix) continue;
        var rowId = name.substring(prefix.length, name.length - suffix.length);
        if (!rows[rowId]) {
          rows[rowId] = { id: rowId, prefix: prefix, values: dictionary(), names: dictionary(), refs: dictionary() };
        }
        rows[rowId].values[field] = attribute.get('current');
        rows[rowId].names[field] = name;
        rows[rowId].refs[field] = name;
        break;
      }
    });
    var orderName = '_reporder_repeating_' + section;
    var orderAttribute = attributes.filter(function (attribute) {
      return trim(attribute.get('name')) === orderName;
    })[0];
    var ordered = trim(orderAttribute && orderAttribute.get('current'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    var orderedRows = dictionary();
    ordered.forEach(function (rowId) { orderedRows[rowId] = true; });
    Object.keys(rows).sort().forEach(function (rowId) {
      if (!orderedRows[rowId]) {
        ordered.push(rowId);
        orderedRows[rowId] = true;
      }
    });
    ordered = ordered.filter(function (rowId) {
      return !!rows[rowId];
    });
    ordered.forEach(function (rowId, index) {
      fields.forEach(function (field) {
        var row = rows[rowId];
        var exactName = prefix + rowId + '_' + field;
        if (!row.names[field]) row.names[field] = exactName;
        if (own(row.values, field)) return;
        var orderedName = prefix + '$' + index + '_' + field;
        var value = getAttr(characterId, orderedName);
        if (value === undefined) return;
        row.values[field] = value;
        row.refs[field] = orderedName;
      });
    });
    return ordered.map(function (rowId) {
      return rows[rowId];
    });
  }

  function sheetContracts() {
    var found = dictionary();
    var result = [];
    if (!Array.isArray(KIBSheetContracts)) return result;
    for (var i = KIBSheetContracts.length - 1; i >= 0; i--) {
      var contract = KIBSheetContracts[i];
      if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) || found[contract.id]) continue;
      found[contract.id] = true;
      result.unshift(contract);
    }
    return result;
  }

  function registerContract(contract) {
    if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) ||
      (!contractSignature(contract).entries.length && !(Array.isArray(contract.attributes) && contract.attributes.length)))
      throw new Error('시트 인식 정보 형식이 올바르지 않습니다.');
    var replaced = false;
    KIBSheetContracts = KIBSheetContracts.map(function (current) {
      if (current && current.id === contract.id) {
        replaced = true;
        return contract;
      }
      return current;
    });
    if (!replaced) KIBSheetContracts.push(contract);
    contractCatalogCache = null;
    invalidate();
    return contract;
  }

  function contractSignature(contract) {
    var source = contract && contract.signature;
    var entries = [];
    var minimum = 0;
    var requiredNames = [];
    if (Array.isArray(source)) {
      entries = source;
    } else if (source && typeof source === 'object') {
      var attrs = source.attrs || source.attributes || source.required;
      if (Array.isArray(source.required)) requiredNames = source.required.map(trim);
      if (Array.isArray(attrs)) entries = attrs;
      else {
        Object.keys(source).forEach(function (name) {
          if (/^(?:min|minimum|threshold|attrs|attributes|required)$/i.test(name)) return;
          entries.push({ name: name, weight: source[name] });
        });
      }
      minimum = Number(source.minimum || source.min || source.threshold);
    }
    entries = entries.map(function (entry) {
      if (typeof entry === 'string') return { name: trim(entry), weight: 1, required: requiredNames.indexOf(trim(entry)) > -1 };
      return {
        name: trim(entry && (entry.name || entry.attr || entry.key)),
        weight: Math.max(1, Number(entry && entry.weight) || 1),
        required: !!(entry && entry.required) || requiredNames.indexOf(trim(entry && (entry.name || entry.attr || entry.key))) > -1,
      };
    }).filter(function (entry) { return !!entry.name; });
    var total = entries.reduce(function (sum, entry) { return sum + entry.weight; }, 0);
    if (!(minimum > 0)) minimum = Math.min(total, Math.max(3, Math.ceil(total * 0.6)));
    return { entries: entries, minimum: minimum, total: total };
  }

  function contractDefaultMap(contract) {
    var result = dictionary();
    (contract && contract.fields || []).forEach(function (field) {
      var name = trim(field && field.name);
      if (!name || field.section || !own(field, 'default')) return;
      result[name] = String(field.default == null ? '' : field.default);
    });
    return result;
  }

  function normalizedDefault(value) {
    return trim(value).toLowerCase().replace(/\s+/g, '');
  }

  function sourceDefaultEvidence(characterId, records, savedNames) {
    var scores = records.map(function () { return 0; });
    var blankContradictions = records.map(function () { return 0; });
    var missingContradictions = records.map(function () { return 0; });
    var sourceContradictions = records.map(function () { return 0; });
    var active = records.slice();
    var used = dictionary(),probes = [];
    var reads = typeof getSheetDefaultValue == 'function'?getSheetDefaultValue:cachedAttrReader(characterId);
    var savedUnique = records.map(function () { return 0; });
    Object.keys(savedNames || {}).forEach(function (name) {
      var owners = records.filter(function (record) { return !!record.globalSet[name]; });
      if (owners.length === 1) savedUnique[owners[0].ordinal] += 1;
    });
    function expectedDefault(record, name) {
      return own(record.defaults, name)
        ? 'value:' + normalizedDefault(record.defaults[name])
        : 'missing';
    }
    var available = dictionary();
    records.forEach(function (record) {
      Object.keys(record.defaults || {}).forEach(function (name) { available[name] = true; });
    });
    var defaultNames = Object.keys(available).sort();
    var defaultValues = dictionary();
    var separatingDefaultNames = [];
    defaultNames.forEach(function (name) {
      var firstExpected = '';
      var different = false;
      var hasNonEmpty = false;
      var values = records.map(function (record, index) {
        var expected = expectedDefault(record, name);
        if (!index) firstExpected = expected;
        else if (expected !== firstExpected) different = true;
        if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        return expected;
      });
      defaultValues[name] = values;
      if ((!savedNames || !savedNames[name]) && hasNonEmpty && different)
        separatingDefaultNames.push(name);
    });
    function nextField() {
      if (!active.length) return '';
      if (active.length === 1) {
        for (var only = 0; only < defaultNames.length; only += 1) {
          var confirmation = defaultNames[only];
          if (!used[confirmation] && !(savedNames && savedNames[confirmation]) &&
              own(active[0].defaults || {}, confirmation) &&
              normalizedDefault((active[0].defaults || {})[confirmation])) return confirmation;
        }
        return '';
      }
      var selected = '';
      var selectedSeparation = -1;
      for (var fieldAt = 0; fieldAt < separatingDefaultNames.length; fieldAt += 1) {
        var name = separatingDefaultNames[fieldAt];
        if (used[name]) continue;
        var counts = dictionary();
        var hasNonEmpty = false;
        for (var activeAt = 0; activeAt < active.length; activeAt += 1) {
          var expected = defaultValues[name][active[activeAt].ordinal];
          counts[expected] = (counts[expected] || 0) + 1;
          if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        }
        var groups = Object.keys(counts);
        if (!hasNonEmpty || groups.length < 2) continue;
        var separation = active.length * active.length;
        groups.forEach(function (value) {
          separation -= counts[value] * counts[value];
        });
        if (separation > selectedSeparation) {
          selected = name;
          selectedSeparation = separation;
        }
      }
      return selected;
    }
    for (var attempt = 0; attempt < 48; attempt += 1) {
      var name = nextField();
      if (!name) break;
      used[name] = true;
      var rawActual = reads(name);
      var actual = normalizedDefault(rawActual);
      if (rawActual === undefined || rawActual === null) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) missingContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: '', matches: [] });
      } else if (!actual) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) blankContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: [] });
      } else {
        var actualDefault = 'value:' + actual;
        // 현재 원본에 있는 필드를 선언하지 않은 후보는 공통 기본값이 같아도 제외합니다.
        // getAttrByName 대체 경로에는 이전 시트의 저장값이 섞일 수 있습니다.
        if (typeof getSheetDefaultValue === 'function') records.forEach(function (record) {
          if (!record.globalSet[name]) sourceContradictions[record.ordinal] += 1;
          else if (own(record.defaults, name) && normalizedDefault(record.defaults[name]) !== actual &&
              /[&?]\{|\{\{/.test(record.defaults[name] + actual)) {
            // 수치 보정은 중립으로 두되, 서로 다른 원본 굴림/템플릿 조각은 구별합니다.
            var alternatives = [record.defaults[name]];
            (record.contract.fields || []).forEach(function (field) {
              if (!field.section && field.name === name)
                alternatives = alternatives.concat(field.defaultVariants || []);
            });
            alternatives = alternatives.concat(contractOptionValues((record.contract.controls || {})[name]));
            if (!alternatives.some(function (value) { return normalizedDefault(value) === actual; }))
              sourceContradictions[record.ordinal] += 1;
          }
        });
        var matched = records.filter(function (record) {
          return defaultValues[name][record.ordinal] === actualDefault;
        });
        matched.forEach(function (record) {
          scores[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: matched.map(function (record) { return record.contract.id; }) });
      }
      var strongest = Math.max.apply(Math, scores);
      var viable = records.filter(function (record) {
        return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
      });
      var band = viable.filter(function (record) {
        return strongest < 2 || scores[record.ordinal] >= strongest - 2;
      });
      active = band.length ? band : viable.length ? viable : records.slice();
      var leaders = active.filter(function (record) { return scores[record.ordinal] === strongest; });
      var nextScore = active.filter(function (record) { return scores[record.ordinal] < strongest; })
        .reduce(function (maximum, record) { return Math.max(maximum, scores[record.ordinal]); }, 0);
      if (leaders.length === 1 && strongest >= 2 && strongest - nextScore >= 2 &&
          sourceContradictions[leaders[0].ordinal] === 0 &&
          savedUnique[leaders[0].ordinal] >= 2)
        return { record: leaders[0], survivors: active, scores: scores, probes: probes, matched: true };
    }
    var candidates = records.filter(function (record) {
      return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) candidates = records.filter(function (record) {
      return sourceContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) return { record: null, survivors: [],
      scores: scores, probes: probes, matched: false };
    var ranked = candidates.sort(function (left, right) {
      return scores[right.ordinal] - scores[left.ordinal] || left.ordinal - right.ordinal;
    });
    var bestScore = ranked.length ? scores[ranked[0].ordinal] : 0;
    var best = ranked.filter(function (record) { return scores[record.ordinal] === bestScore; });
    var runnerScore = ranked[best.length] ? scores[ranked[best.length].ordinal] : 0;
    if (best.length === 1 && bestScore >= 2 && (bestScore - runnerScore >= 2 || ranked.length === 1))
      return { record: best[0], survivors: ranked, scores: scores, probes: probes, matched: true };
    active = ranked.filter(function (record) {
      return scores[record.ordinal] >= Math.max(0, bestScore - 1);
    });
    return { record: null, survivors: active.length ? active : ranked,
      scores: scores, probes: probes, matched: false };
  }

  function roomSourceDefaultEvidence(characters, records, ownersByName) {
    var fallback = { record: null, survivors: records.slice(), scores: records.map(function () { return 0; }), probes: [], matched: false };
    var savedCounts = dictionary();
    (characters || []).forEach(function (character) { savedCounts[character.id] = 0; });
    Object.keys(ownersByName || {}).forEach(function (name) {
      Object.keys(ownersByName[name] || {}).forEach(function (characterId) {
        if (own(savedCounts, characterId)) savedCounts[characterId] += 1;
      });
    });
    var candidates = (characters || []).slice().sort(function (left, right) {
      return savedCounts[left.id] - savedCounts[right.id] ||
        trim(left.get('name')).localeCompare(trim(right.get('name')));
    });
    var character = candidates[0];
    if (!character) return fallback;
    var savedNames = dictionary();
    Object.keys(ownersByName || {}).forEach(function (name) {
      if (ownersByName[name] && ownersByName[name][character.id]) savedNames[name] = true;
    });
    var evidence = sourceDefaultEvidence(character.id, records, savedNames);
    evidence.characterId = character.id;
    return evidence;
  }

  function trieNode() {
    return { next: dictionary(), values: [] };
  }

  function trieAdd(root, value, entry) {
    var node = root;
    for (var i = 0; i < value.length; i += 1) {
      var character = value.charAt(i);
      if (!node.next[character]) node.next[character] = trieNode();
      node = node.next[character];
    }
    node.values.push(entry);
  }

  function triePrefixes(root, value) {
    var node = root;
    var result = [];
    for (var i = 0; i < value.length; i += 1) {
      node = node.next[value.charAt(i)];
      if (!node) break;
      if (node.values.length) result = result.concat(node.values);
    }
    return result;
  }

  function fieldSuffixTrie(fields) {
    var root = trieNode();
    (fields || []).forEach(function (field) {
      var suffix = '_' + field;
      trieAdd(root, suffix.split('').reverse().join(''), field);
    });
    return root;
  }

  function matchedField(root, name, prefixLength) {
    var node = root;
    var found = '';
    for (var i = name.length - 1; i >= prefixLength; i -= 1) {
      node = node.next[name.charAt(i)];
      if (!node) break;
      if (node.values.length) found = node.values[0];
    }
    return found;
  }

  function recognitionCatalog(contracts) {
    if (contractCatalogCache && contractCatalogCache.contracts.length === contracts.length &&
        contractCatalogCache.contracts.every(function (contract, index) { return contract === contracts[index]; }))
      return contractCatalogCache;
    var catalog = { contracts: contracts.slice(), records: [], exact: dictionary(), prefixes: trieNode() };
    function post(name, posting) {
      if (!name) return;
      if (!catalog.exact[name]) catalog.exact[name] = [];
      catalog.exact[name].push(posting);
    }
    contracts.forEach(function (contract, ordinal) {
      var signature = contractSignature(contract);
      var runtime = contractRuntimeIndex(contract);
      var attributes = Array.isArray(contract.attributes) ? contract.attributes.map(trim).filter(Boolean) : [];
      var globalAttributes = (Array.isArray(contract.globalAttributes) ? contract.globalAttributes : attributes)
        .map(trim).filter(Boolean);
      var globalSet = dictionary();
      globalAttributes.forEach(function (name) { globalSet[name] = true; });
      var record = {
        contract: contract,
        ordinal: ordinal,
        signature: signature,
        attributes: attributes,
        globalAttributes: globalAttributes,
        globalSet: globalSet,
        globalCount: Object.keys(globalSet).length,
        defaults: contractDefaultMap(contract),
        required: signature.entries.filter(function (entry) { return entry.required; }).map(function (entry) { return entry.name; }),
      };
      catalog.records.push(record);
      signature.entries.forEach(function (entry) {
        post(entry.name, { record: record, type: 'signature', weight: entry.weight });
      });
      Object.keys(runtime.exact).forEach(function (name) {
        post(name, { record: record, type: signature.total ? 'dependency' : 'source', key: name });
      });
      runtime.prefixes.forEach(function (prefix) {
        var section = runtime.prefixSections[prefix];
        trieAdd(catalog.prefixes, prefix, {
          record: record,
          prefix: prefix,
          section: section,
          fields: fieldSuffixTrie(runtime.sections[section] || []),
        });
      });
    });
    contractCatalogCache = catalog;
    return catalog;
  }

  function inspectContracts(characterId) {
    if (contractMatchCache.__room__) {
      if (characterId) contractMatchCache[characterId] = contractMatchCache.__room__;
      return contractMatchCache.__room__;
    }
    var defaultEvidence = { probes: [], scores: [], matched: false };
    function remember(result) {
      result.attributeCount = persistentTotal;
      result.contractCount = contracts.length;
      contractMatchCache.__room__ = result;
      if (characterId) contractMatchCache[characterId] = result;
      return result;
    }
    var roomCharacters = characterObjects();
    var liveOwners = dictionary();
    roomCharacters.forEach(function (character) { liveOwners[character.id] = true; });
    var attributes = (
      findObjs({ _type: 'attribute' }) ||
      findObjs({ type: 'attribute' }) ||
      []
    ).filter(function (attribute) {
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      return !!liveOwners[owner];
    });
    var names = dictionary();
    var ownersByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (!name) return;
      names[name] = true;
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      if (!ownersByName[name]) ownersByName[name] = dictionary();
      if (owner) ownersByName[name][owner] = true;
    });
    var contracts = sheetContracts();
    var catalog = recognitionCatalog(contracts);
    defaultEvidence = roomSourceDefaultEvidence(roomCharacters, catalog.records, ownersByName);
    var nameList = Object.keys(names);
    var persistentTotal = nameList.length;
    var repeatingTotal = nameList.filter(function (name) {
      return name.indexOf('repeating_') === 0;
    }).length;
    var stats = catalog.records.map(function () {
      return {
        signatureScore: 0, signatureSeen: dictionary(), sourceSeen: dictionary(),
        repeatingHits: 0, repeatingSections: dictionary(), support: dictionary(),
        uniqueSeen: dictionary(), uniqueOwners: dictionary(),
      };
    });
    var recognizedFieldsByOwner = dictionary();
    var compatibilityByOwner = dictionary();
    var membershipByOwner = dictionary();
    function markSupport(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.support[owner] = true; });
    }
    function markRecognized(contractsForName, name) {
      var ordinals = Object.keys(contractsForName);
      if (!ordinals.length) return;
      var membership = ordinals.join(',');
      Object.keys(ownersByName[name] || {}).forEach(function (owner) {
        recognizedFieldsByOwner[owner] = (recognizedFieldsByOwner[owner] || 0) + 1;
        if (!compatibilityByOwner[owner]) compatibilityByOwner[owner] = dictionary();
        ordinals.forEach(function (ordinal) {
          compatibilityByOwner[owner][ordinal] = (compatibilityByOwner[owner][ordinal] || 0) + 1;
        });
        if (!membershipByOwner[owner]) membershipByOwner[owner] = dictionary();
        membershipByOwner[owner][membership] = (membershipByOwner[owner][membership] || 0) + 1;
      });
    }
    function markUniqueOwners(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.uniqueOwners[owner] = true; });
    }
    nameList.forEach(function (name) {
      var exactPostings = catalog.exact[name] || [];
      var exactContracts = dictionary();
      exactPostings.forEach(function (posting) {
        exactContracts[posting.record.ordinal] = true;
        var stat = stats[posting.record.ordinal];
        if (posting.type === 'signature') {
          if (!stat.signatureSeen[name]) {
            stat.signatureSeen[name] = true;
            stat.signatureScore += posting.weight;
            markSupport(stat, name);
          }
        } else if (posting.type === 'source') {
          stat.sourceSeen[posting.key] = true;
          markSupport(stat, name);
        }
      });
      var exactOrdinals = Object.keys(exactContracts);
      if (exactOrdinals.length === 1) {
        var exactStat = stats[Number(exactOrdinals[0])];
        exactStat.uniqueSeen[name] = true;
        markUniqueOwners(exactStat, name);
        markSupport(exactStat, name);
      }
      if (name.indexOf('repeating_') !== 0) {
        markRecognized(exactContracts, name);
        return;
      }
      var matches = triePrefixes(catalog.prefixes, name);
      var seenContracts = dictionary();
      var matchedByContract = dictionary();
      for (var index = matches.length - 1; index >= 0; index -= 1) {
        var match = matches[index];
        var ordinal = match.record.ordinal;
        if (seenContracts[ordinal]) continue;
        var field = matchedField(match.fields, name, match.prefix.length);
        if (!field) continue;
        seenContracts[ordinal] = true;
        var repeatingStat = stats[ordinal];
        repeatingStat.repeatingHits += 1;
        repeatingStat.repeatingSections[match.section] = true;
        markSupport(repeatingStat, name);
        var sourceKey = 'repeating_' + match.section + '_' + field;
        matchedByContract[ordinal] = sourceKey;
        if (!match.record.signature.total) repeatingStat.sourceSeen[sourceKey] = true;
      }
      var repeatingOrdinals = Object.keys(matchedByContract);
      repeatingOrdinals.forEach(function (ordinal) { exactContracts[ordinal] = true; });
      markRecognized(exactContracts, name);
      if (repeatingOrdinals.length === 1) {
        var repeatingOrdinal = Number(repeatingOrdinals[0]);
        stats[repeatingOrdinal].uniqueSeen[matchedByContract[repeatingOrdinal]] = true;
        markUniqueOwners(stats[repeatingOrdinal], name);
      }
    });
    var recognizedOwnerCount = Object.keys(recognizedFieldsByOwner).length;
    var compatibilityVotes = catalog.records.map(function () { return 0; });
    Object.keys(recognizedFieldsByOwner).forEach(function (owner) {
      var total = recognizedFieldsByOwner[owner];
      if (total < 2) return;
      var coverage = compatibilityByOwner[owner] || {};
      var ranked = catalog.records.map(function (record) {
        return { ordinal: record.ordinal, count: coverage[record.ordinal] || 0 };
      }).sort(function (left, right) {
        return right.count - left.count || left.ordinal - right.ordinal;
      });
      var best = ranked[0];
      var runnerUp = ranked[1] || { ordinal: -1, count: 0 };
      if (!best || best.count / total < 0.9 || best.count <= runnerUp.count) return;
      var bestOnly = 0;
      var runnerOnly = 0;
      Object.keys(membershipByOwner[owner] || {}).forEach(function (membership) {
        var members = (',' + membership + ',');
        var count = membershipByOwner[owner][membership];
        var hasBest = members.indexOf(',' + best.ordinal + ',') >= 0;
        var hasRunner = members.indexOf(',' + runnerUp.ordinal + ',') >= 0;
        if (hasBest && !hasRunner) bestOnly += count;
        if (hasRunner && !hasBest) runnerOnly += count;
      });
      var completeFieldAdvantage = total >= 5 && best.count === total && bestOnly >= 1 && runnerOnly === 0;
      if (completeFieldAdvantage || (total >= 5 && bestOnly >= 2 && bestOnly > runnerOnly))
        compatibilityVotes[best.ordinal] += 1;
    });
    var scored = catalog.records.map(function (record) {
      var contract = record.contract;
      var signature = record.signature;
      var stat = stats[record.ordinal];
      var signatureScore = stat.signatureScore;
      var sourceScore = Object.keys(stat.sourceSeen).length;
      var missingRequired = record.required.filter(function (name) { return !stat.signatureSeen[name]; });
      var contractAttributes = record.attributes;
      var repeatingHits = stat.repeatingHits;
      var repeatingSections = stat.repeatingSections;
      var supportCount = Object.keys(stat.support).length;
      var uniqueEvidence = Object.keys(stat.uniqueSeen).length;
      var uniqueOwnerCount = Object.keys(stat.uniqueOwners).length;
      var useSignature = signature.total > 0;
      var score = useSignature ? signatureScore : sourceScore;
      var total = useSignature ? signature.total : contractAttributes.length;
      var minimum = useSignature ? signature.minimum : Math.min(3, total);
      var ratio = total ? score / total : 0;
      var structuralMatch = useSignature || ratio >= 0.6 || (score >= 6 && ratio >= 0.4);
      var repeatingRatio = repeatingTotal ? repeatingHits / repeatingTotal : 1;
      var rankScore = score + repeatingHits * 2 + Object.keys(repeatingSections).length * 3;
      return {
        contract: contract,
        id: contract.id,
        name: contract.name || contract.id,
        score: score,
        ratio: ratio,
        repeatingHits: repeatingHits,
        repeatingTotal: repeatingTotal,
        repeatingRatio: repeatingRatio,
        supportCount: supportCount,
        uniqueEvidence: uniqueEvidence,
        uniqueOwnerCount: uniqueOwnerCount,
        compatibilityOwnerCount: compatibilityVotes[record.ordinal],
        defaultMatchCount: defaultEvidence.scores[record.ordinal] || 0,
        rankScore: rankScore,
        minimum: minimum,
        missingRequired: missingRequired,
        eligible: total > 0 && missingRequired.length === 0 && score >= minimum && structuralMatch,
      };
    }).sort(function (a, b) {
      return b.compatibilityOwnerCount - a.compatibilityOwnerCount ||
        b.supportCount - a.supportCount || b.uniqueEvidence - a.uniqueEvidence || b.rankScore - a.rankScore ||
        b.repeatingHits - a.repeatingHits || b.score - a.score || b.ratio - a.ratio;
    });
    if (defaultEvidence.matched) {
      var match = scored.filter(function (item) {
        return item.id === defaultEvidence.record.contract.id;
      })[0];
      return remember({ status: 'matched', contract: defaultEvidence.record.contract,
        match: match, matches: scored, recognitionReason: 'source-defaults' });
    }
    var sourceSurvivors = dictionary();
    (defaultEvidence.survivors || []).forEach(function (record) { sourceSurvivors[record.contract.id] = true; });
    var sourceSurvivorCount = Object.keys(sourceSurvivors).length;
    var sourceNarrowed = sourceSurvivorCount < catalog.records.length;
    var selection = sourceNarrowed
      ? scored.filter(function (item) { return sourceSurvivors[item.id]; })
      : scored;
    var selectedRecords = dictionary();
    var selectedGlobal = dictionary();
    selection.forEach(function (item) {
      var record = catalog.records.filter(function (record) {
        return record.contract.id === item.id;
      })[0];
      selectedRecords[item.id] = record;
      (record ? record.globalAttributes : []).forEach(function (name) { selectedGlobal[name] = true; });
    });
    var structureVotes = dictionary();
    var structureVoters = 0;
    Object.keys(liveOwners).forEach(function (owner) {
      var observed = dictionary();
      Object.keys(ownersByName).forEach(function (name) {
        if (!ownersByName[name][owner] || name.indexOf('repeating_') === 0 ||
            name.indexOf('_reporder_repeating_') === 0) return;
        if (selectedGlobal[name]) observed[name] = true;
      });
      var observedNames = Object.keys(observed);
      var observedCount = observedNames.length;
      if (observedCount < 5) return;
      var ranked = selection.map(function (item) {
        var record = selectedRecords[item.id];
        var declared = record ? record.globalSet : dictionary();
        var declaredCount = record ? record.globalCount : 0;
        var hits = observedNames.filter(function (name) { return declared[name]; }).length;
        var union = observedCount + declaredCount - hits;
        return {
          id: item.id,
          score: union ? hits / union : 0,
          observedCoverage: hits / observedCount,
          declaredCoverage: declaredCount ? hits / declaredCount : 0,
        };
      }).sort(function (left, right) { return right.score - left.score; });
      var bestStructure = ranked[0];
      var runnerStructure = ranked[1] || { score: 0 };
      if (!bestStructure || bestStructure.score < 0.9 || bestStructure.observedCoverage < 0.9 ||
          bestStructure.declaredCoverage < 0.9 || bestStructure.score - runnerStructure.score < 0.05) return;
      structureVotes[bestStructure.id] = (structureVotes[bestStructure.id] || 0) + 1;
      structureVoters += 1;
    });
    var structureWinner = selection.filter(function (item) {
      return (structureVotes[item.id] || 0) * 2 > structureVoters;
    });
    if (structureVoters && structureWinner.length === 1)
      return remember({ status: 'matched', contract: structureWinner[0].contract,
        match: structureWinner[0], matches: selection, recognitionReason: 'stored-structure' });
    var compatibilityWinner = selection.filter(function (item) {
      return item.compatibilityOwnerCount * 2 > recognizedOwnerCount;
    });
    if (compatibilityWinner.length === 1)
      return remember({ status: 'matched', contract: compatibilityWinner[0].contract,
        match: compatibilityWinner[0], matches: selection, recognitionReason: 'stored-attributes' });
    var eligible = selection.filter(function (item) { return item.eligible; });
    if (!eligible.length) {
      if (!selection.length) return remember({ status: 'none', contract: null, matches: [],
        recognitionReason: contracts.length ? 'conflicting-source-fields' : 'no-contracts' });
      var evidence = selection[0];
      var runnerUp = selection[1];
      if (!sourceNarrowed && evidence.uniqueEvidence >= 2 && (!runnerUp ||
          evidence.supportCount > runnerUp.supportCount || runnerUp.uniqueEvidence === 0) &&
          evidence.uniqueOwnerCount * 2 > recognizedOwnerCount)
        return remember({ status: 'matched', contract: evidence.contract, match: evidence, matches: selection,
          recognitionReason: 'stored-unique-attributes' });
      return remember({
        status: 'ambiguous', contract: null, matches: selection,
        error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous'
          : persistentTotal ? 'insufficient-or-conflicting-evidence' : 'no-saved-attributes-or-default-match',
      });
    }
    var best = eligible[0];
    if (best.supportCount * 2 <= recognizedOwnerCount) {
      return remember({ status: 'ambiguous', contract: null, matches: selection, error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous' : 'insufficient-room-support' });
    }
    var close = eligible.filter(function (item) {
      return item.supportCount === best.supportCount && best.rankScore - item.rankScore <= 2 &&
        best.ratio - item.ratio < 0.1 && Math.abs(best.repeatingHits - item.repeatingHits) <= 1;
    });
    if (close.length === 1)
      return remember({ status: 'matched', contract: best.contract, match: best, matches: selection,
        recognitionReason: 'stored-signature' });
    return remember({ status: 'ambiguous', contract: null, matches: close, error: SHEET_NOT_RECOGNIZED,
      recognitionReason: sourceNarrowed
        ? 'source-defaults-ambiguous' : 'conflicting-candidates' });
  }

  function usableContractInspection(inspection) {
    return !!inspection && (inspection.status === 'matched' ||
      (inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'));
  }

  function sourceCandidateInspections(inspection) {
    if (!usableContractInspection(inspection)) return [];
    if (inspection.status === 'matched') return [inspection];
    return (inspection.matches || []).map(function (match) {
      return { status: 'matched', contract: match.contract, match: match, matches: inspection.matches };
    });
  }

  function contractControlList(source) {
    if (Array.isArray(source)) return source;
    if (!source || typeof source !== 'object') return [];
    return Object.keys(source).map(function (name) {
      var value = source[name];
      if (value && typeof value === 'object' && !Array.isArray(value))
        return merge({ name: name }, value);
      return { name: name, options: Array.isArray(value) ? value : [value] };
    });
  }

  function contractControls(contract, roll) {
    var controls = contractControlList(contract && contract.controls);
    contractControlList(roll && roll.controls).forEach(function (local) {
      var name = trim(local && (local.name || local.attr || local.key));
      controls = controls.filter(function (control) {
        return trim(control && (control.name || control.attr || control.key)) !== name;
      });
      controls.push(local);
    });
    return controls;
  }

  function contractControlName(control) {
    return trim(control && (control.name || control.attr || control.key));
  }

  function contractVisibilityResult(condition, valueReader) {
    if (!condition || typeof condition !== 'object') return null;
    if (condition.never === true) return false;
    if (Array.isArray(condition.all)) {
      if (!condition.all.length) return null;
      var allUnknown = false;
      for (var allIndex = 0; allIndex < condition.all.length; allIndex += 1) {
        var allValue = contractVisibilityResult(condition.all[allIndex], valueReader);
        if (allValue === false) return false;
        if (allValue === null) allUnknown = true;
      }
      return allUnknown ? null : true;
    }
    if (Array.isArray(condition.any)) {
      if (!condition.any.length) return null;
      var anyUnknown = false;
      for (var anyIndex = 0; anyIndex < condition.any.length; anyIndex += 1) {
        var anyValue = contractVisibilityResult(condition.any[anyIndex], valueReader);
        if (anyValue === true) return true;
        if (anyValue === null) anyUnknown = true;
      }
      return anyUnknown ? null : false;
    }
    if (condition.not) {
      var negated = contractVisibilityResult(condition.not, valueReader);
      return negated === null ? null : !negated;
    }
    var name = trim(condition.name);
    var op = trim(condition.op).toLowerCase();
    if (!name || !op || typeof valueReader !== 'function') return null;
    var resolved = valueReader(name, condition);
    if (!resolved || resolved.known !== true) return null;
    var actual = String(resolved.value == null ? '' : resolved.value);
    var expected = String(condition.value == null ? '' : condition.value);
    var matched;
    if (op === 'eq' || op === 'not-eq' || op === 'neq') matched = actual === expected;
    else if (op === 'starts' || op === 'not-starts') matched = actual.indexOf(expected) === 0;
    else if (op === 'ends' || op === 'not-ends') matched = expected === '' || actual.slice(actual.length - expected.length) === expected;
    else if (op === 'contains' || op === 'not-contains') matched = actual.indexOf(expected) > -1;
    else if (op === 'token' || op === 'not-token') matched = actual.split(/\s+/).indexOf(expected) > -1;
    else if (op === 'dash' || op === 'not-dash') matched = actual === expected || actual.indexOf(expected + '-') === 0;
    else return null;
    return op.indexOf('not-') === 0 || op === 'neq' ? !matched : matched;
  }

  function contractVisibilityNames(condition, found) {
    found = found || dictionary();
    if (!condition || typeof condition !== 'object') return found;
    if (Array.isArray(condition)) {
      condition.forEach(function (item) { contractVisibilityNames(item, found); });
      return found;
    }
    if (condition.name) found[trim(condition.name)] = true;
    ['all', 'any', 'not'].forEach(function (key) { contractVisibilityNames(condition[key], found); });
    return found;
  }

  function contractOptionValues(control) {
    var source = control && (control.options || control.values);
    if (!Array.isArray(source) && source && typeof source === 'object') {
      source = Object.keys(source).map(function (key) {
        var option = source[key];
        return option && typeof option === 'object' ? option : { label: key, value: option };
      });
    }
    return (Array.isArray(source) ? source : []).map(function (option) {
      return String(option && typeof option === 'object' && own(option, 'value') ? option.value : option);
    });
  }

  function contractOverrides(mode) {
    var source = mode && mode.overrides;
    var result = dictionary();
    if (Array.isArray(source)) {
      source.forEach(function (entry) {
        var name = trim(entry && (entry.name || entry.attr || entry.key));
        if (name && own(entry, 'value')) result[name] = String(entry.value);
      });
    } else if (source && typeof source === 'object') {
      Object.keys(source).forEach(function (name) { result[name] = String(source[name]); });
    }
    return result;
  }

  function contractQueries(mode) {
    var source = mode && mode.queries;
    var result = [];
    if (Array.isArray(source)) result = source;
    else if (source && typeof source === 'object') {
      result = Object.keys(source).map(function (name) {
        var entry = source[name];
        return entry && typeof entry === 'object'
          ? merge({ name: name }, entry)
          : { name: name, value: entry };
      });
    }
    return result.map(function (entry) {
      var name = trim(entry && (entry.name || entry.label || entry.key));
      var duplicate = name.match(/#(\d+)$/);
      return {
        name: duplicate ? trim(name.substring(0, duplicate.index)) : name,
        occurrence: duplicate ? Number(duplicate[1]) : 1,
        raw: String(entry && (entry.raw || entry.query || entry.token) || ''),
        value: String(entry && own(entry, 'value') ? entry.value : ''),
      };
    }).filter(function (entry) { return entry.raw || entry.name; });
  }

  function contractOverridesValid(contract, roll, mode) {
    var controls = contractControls(contract, roll);
    var overrides = contractOverrides(mode);
    return Object.keys(overrides).every(function (name) {
      var control = controls.filter(function (candidate) {
        return contractControlName(candidate) === name;
      })[0];
      return !!control && contractOptionValues(control).indexOf(String(overrides[name])) > -1;
    });
  }

  function contractRefName(ref) {
    return trim(typeof ref === 'string' ? ref : ref && (ref.name || ref.attr || ref.key));
  }

  function contractRepeating(roll) {
    var source = roll && roll.repeating;
    if (!source) return null;
    function sectionName(value) { return trim(value).replace(/^repeating_/i, ''); }
    if (typeof source === 'string') return { section: sectionName(source), fields: [], source: trim(source) };
    return {
      section: sectionName(source.section || source.name),
      fields: Array.isArray(source.fields) ? source.fields.map(contractRefName).filter(Boolean) : [],
      source: trim(source.section || source.name),
    };
  }

  function contractSections(contract) {
    var source = contract && contract.sections;
    var sections = dictionary();
    if (!source || typeof source !== 'object' || Array.isArray(source)) return sections;
    Object.keys(source).forEach(function (section) {
      var name = trim(section).replace(/^repeating_/i, '');
      var fields = Array.isArray(source[section]) ? source[section].map(contractRefName).filter(Boolean) : [];
      if (name && fields.length) sections[name] = fields;
    });
    return sections;
  }

  function contractRollFields(contract, roll, controlMap) {
    var repeating = contractRepeating(roll);
    if (!repeating) return [];
    var fields = repeating.fields.slice();
    [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
      (Array.isArray(refs) ? refs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        var rowLocal = typeof ref === 'object' && (ref.row === true || ref.repeating === true || ref.scope === 'row');
        var control = controlMap && controlMap[name];
        if (!control) control = contractControls(contract, roll).filter(function (candidate) {
          return contractControlName(candidate) === name;
        })[0];
        var controlSection = trim(control && control.repeating).replace(/^repeating_/i, '');
        if (name && (rowLocal || controlSection === repeating.section) && fields.indexOf(name) < 0) fields.push(name);
      });
    });
    return fields;
  }

  function contractRowAttr(contract, roll, row, name) {
    if (!row) return name;
    var index = contractRuntimeIndex(contract);
    var fields = index.rollFields[roll.key] || contractRollFields(contract, roll, index.controls);
    return fields.indexOf(name) > -1 ? (row.refs[name] || row.names[name] || name) : name;
  }

  function contractLabelRef(characterId, contract, roll, row, ref, reader) {
    var name = contractRefName(ref);
    if (!name) return '';
    var fullName = contractRowAttr(contract, roll, row, name);
    var value = reader
      ? reader(fullName, ref && ref.max ? 'max' : 'current')
      : getAttr(characterId, fullName, ref && ref.max ? 'max' : 'current');
    var index = contractRuntimeIndex(contract);
    var repeating = contractRepeating(roll);
    var field = repeating && index.fieldSections[repeating.section] && index.fieldSections[repeating.section][name] ||
      index.fieldGlobal[name];
    return trim(field && field.defaultVariants
      ? contractUnsavedFieldValue(field, value, field.default, ref && ref.max) : value);
  }

  function contractStaticLabels(roll) {
    var source = roll && roll.staticLabels;
    return (Array.isArray(source) ? source : source ? [source] : []).map(function (entry) {
      return trim(entry && typeof entry === 'object' ? entry.value : entry);
    }).filter(Boolean);
  }

  function contractModeLabels(mode) {
    var labels = [mode && mode.label].concat(mode && mode.aliases || []);
    var path = mode && mode.labelPath;
    if (Array.isArray(path)) {
      if (path.length) labels.push(path.join(' '));
      labels = labels.concat(path.slice().reverse());
    } else if (path) {
      labels.push(path);
      labels = labels.concat(String(path).split(/\s*(?:>|\/|\||::)\s*/));
    }
    labels.push(mode && mode.id);
    var found = dictionary();
    return labels.map(trim).filter(function (label) {
      var key = normalize(label);
      if (!key || found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractUserModeLabels(mode) {
    var internalId = normalize(mode && mode.id);
    return contractModeLabels(mode).filter(function (label) {
      var key = normalize(label);
      return key && key !== internalId && !/^mode-?[a-f0-9]{8,}$/i.test(key) &&
        humanContractLabel(label) && !/[?@%&]\{|\{\{|\[\[/.test(label);
    });
  }

  function contractRuntimeIndex(contract) {
    var key = String(contract.id) + '|' + String(contract.sourceHash || '') + '|' + contract.rolls.length;
    var cached = contractIndexCache[key];
    if (cached && cached.contract === contract) return cached;
    var index = {
      contract: contract,
      controls: dictionary(),
      exact: dictionary(),
      prefixes: [],
      prefixSections: dictionary(),
      sections: dictionary(),
      rollFields: dictionary(),
      rollControls: dictionary(),
      rollsByKey: dictionary(),
      labelRefFrequency: dictionary(),
      fieldGlobal: dictionary(),
      fieldSections: dictionary(),
      fieldPrefixes: trieNode(),
      presentationControls: dictionary(),
      presentationRollGates: dictionary(),
      rollVisibilityReach: dictionary(),
    };
    var visibilityReach = dictionary();
    var visibilityConditions = [];
    var visibilityNames = [];
    var rollVisibilityPolarity = dictionary();
    var valueReferences = dictionary();
    function countVisibility(condition) {
      if (!condition) return;
      var index = visibilityConditions.indexOf(condition);
      if (index < 0) {
        index = visibilityConditions.length;
        visibilityConditions.push(condition);
        visibilityNames.push(Object.keys(contractVisibilityNames(condition)));
      }
      visibilityNames[index].forEach(function (name) {
        visibilityReach[name] = (visibilityReach[name] || 0) + 1;
      });
    }
    function countRollVisibility(condition, negated) {
      if (!condition || typeof condition !== 'object') return;
      if (Array.isArray(condition)) {
        condition.forEach(function (item) { countRollVisibility(item, negated); });
        return;
      }
      if (condition.not) countRollVisibility(condition.not, !negated);
      if (condition.name && condition.op) {
        var name = trim(condition.name);
        var op = trim(condition.op).toLowerCase();
        var negative = op.indexOf('not-') === 0 || op === 'neq';
        var polarity = negative !== !!negated ? 'negative' : 'positive';
        if (!rollVisibilityPolarity[name])
          rollVisibilityPolarity[name] = {
            positive: false,
            negative: false,
            positiveValues: dictionary(),
            positiveEqualityOnly: true,
          };
        rollVisibilityPolarity[name][polarity] = true;
        if (polarity === 'positive') {
          rollVisibilityPolarity[name].positiveEqualityOnly =
            rollVisibilityPolarity[name].positiveEqualityOnly && op === 'eq';
          if (own(condition, 'value'))
            rollVisibilityPolarity[name].positiveValues[String(condition.value)] = true;
        }
      }
      ['all', 'any'].forEach(function (key) { countRollVisibility(condition[key], negated); });
    }
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      if (!field.section) {
        index.fieldGlobal[trim(field.name)] = field;
        index.exact[trim(field.name)] = true;
      }
      else {
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (!index.fieldSections[section]) index.fieldSections[section] = dictionary();
        index.fieldSections[section][trim(field.name)] = field;
      }
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      function addDependency(name, scope) {
        name = trim(name);
        if (!name) return;
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (section && scope !== 'global' && index.fieldSections[section] && index.fieldSections[section][name]) return;
        index.exact[name] = true;
      }
      [field.default, field.max].forEach(function (source) {
        String(source == null ? '' : source).replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (token, name) {
          valueReferences[trim(name)] = true;
          addDependency(name, '');
          return token;
        });
      });
      (function visit(condition) {
        if (!condition || typeof condition !== 'object') return;
        if (Array.isArray(condition)) {
          condition.forEach(visit);
          return;
        }
        if (condition.name) addDependency(condition.name, trim(condition.scope).toLowerCase());
        ['all', 'any', 'not'].forEach(function (key) { visit(condition[key]); });
      })(field.visibility);
      countVisibility(field.visibility);
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      var prefix = 'repeating_' + section + '_';
      trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    contractControls(contract).forEach(function (control) {
      var name = contractControlName(control);
      if (name) {
        index.controls[name] = control;
        index.exact[name] = true;
      }
    });
    var exactAttributes = Array.isArray(contract.globalAttributes) ? contract.globalAttributes : contract.attributes;
    (Array.isArray(exactAttributes) ? exactAttributes : []).forEach(function (name) {
      name = trim(name);
      if (name) index.exact[name] = true;
    });
    contractSignature(contract).entries.forEach(function (entry) { index.exact[entry.name] = true; });
    var declaredSections = contractSections(contract);
    Object.keys(declaredSections).forEach(function (section) {
      index.sections[section] = declaredSections[section].slice();
      index.prefixes.push('repeating_' + section + '_');
      index.exact['_reporder_repeating_' + section] = true;
    });
    contract.rolls.forEach(function (roll) {
      if (!roll) return;
      var rollKey = String(roll.key);
      if (!own(index.rollsByKey, rollKey)) index.rollsByKey[rollKey] = roll;
      countVisibility(roll.visibility);
      countRollVisibility(roll.visibility, false);
      Object.keys(contractVisibilityNames(roll.visibility)).forEach(function (name) {
        index.rollVisibilityReach[name] = (index.rollVisibilityReach[name] || 0) + 1;
      });
      var scopedControls = dictionary();
      contractControls(contract, roll).forEach(function (control) {
        var name = contractControlName(control);
        if (name) scopedControls[name] = control;
      });
      var repeating = contractRepeating(roll);
      var fields = repeating ? contractRollFields(contract, roll, scopedControls) : [];
      function addExact(name) {
        if (name && (!repeating || fields.indexOf(name) < 0)) index.exact[name] = true;
      }
      (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) index.labelRefFrequency[name] = (index.labelRefFrequency[name] || 0) + 1;
      });
      [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
        (Array.isArray(refs) ? refs : []).forEach(function (ref) {
          var name = contractRefName(ref);
          if (name) valueReferences[name] = true;
          addExact(name);
        });
      });
      (roll.modes || []).forEach(function (mode) {
        Object.keys(mode && mode.overrides || {}).forEach(function (name) { valueReferences[name] = true; });
      });
      Object.keys(scopedControls).forEach(function (name) {
        addExact(name);
      });
      index.rollControls[roll.key] = scopedControls;
      if (!repeating || !repeating.section) return;
      if (!index.sections[repeating.section]) {
        index.sections[repeating.section] = [];
        index.prefixes.push('repeating_' + repeating.section + '_');
        index.exact['_reporder_repeating_' + repeating.section] = true;
      }
      index.rollFields[roll.key] = fields;
      fields.forEach(function (field) {
        if (index.sections[repeating.section].indexOf(field) < 0) index.sections[repeating.section].push(field);
      });
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || field.section || !/^(?:checkbox|radio)$/i.test(trim(field.type))) return;
      if ((visibilityReach[field.name] || 0) > 1 && !valueReferences[field.name])
        index.presentationControls[field.name] = true;
    });
    Object.keys(index.presentationControls).forEach(function (name) {
      var polarity = rollVisibilityPolarity[name];
      var field = index.fieldGlobal[name];
      var positiveValues = polarity ? Object.keys(polarity.positiveValues || {}) : [];
      var onValue = field && own(field, 'onValue') ? String(field.onValue) : '';
      var positiveCollapsedPanel = polarity && polarity.positive && !polarity.negative &&
        polarity.positiveEqualityOnly && positiveValues.length === 1 &&
        (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length &&
        field && trim(field.default) === '' && onValue !== '' && positiveValues[0] === onValue;
      if ((polarity && polarity.negative && !polarity.positive &&
          (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length) ||
          positiveCollapsedPanel)
        index.presentationRollGates[name] = true;
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      if (!index.sections[section]) index.sections[section] = [];
      Object.keys(index.fieldSections[section]).forEach(function (field) {
        if (index.sections[section].indexOf(field) < 0) index.sections[section].push(field);
      });
      var prefix = 'repeating_' + section + '_';
      if (index.prefixes.indexOf(prefix) < 0) index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + section] = true;
    });
    var sectionCounts = dictionary();
    Object.keys(index.sections).forEach(function (section) {
      index.sections[section].sort(function (left, right) { return right.length - left.length; });
      index.prefixSections['repeating_' + section + '_'] = section;
      var folded = section.toLowerCase();
      sectionCounts[folded] = (sectionCounts[folded] || 0) + 1;
    });
    Object.keys(index.sections).forEach(function (section) {
      var folded = section.toLowerCase();
      var prefix = 'repeating_' + folded + '_';
      if (section === folded || sectionCounts[folded] !== 1 || own(index.prefixSections, prefix)) return;
      index.prefixSections[prefix] = section;
      index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + folded] = true;
      if (index.fieldSections[section]) trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    index.prefixes.sort(function (left, right) { return right.length - left.length; });
    contractIndexCache[key] = index;
    return index;
  }

  function humanContractLabel(value) {
    var label = trim(value);
    return !!label && label.length <= 100 &&
      !!label.replace(/[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/g, '') &&
      !/^(?:true|false|on|off|null|none)$/i.test(label);
  }

  function contractDisplayLabel(value) {
    var label = trim(value).replace(/^븿\s*/, '');
    if (!humanContractLabel(label)) return '';
    if (/^[\d.,%()+\-*/]+$/.test(label) || /^\d*d\d+(?:[+\-*/]\d+(?:\.\d+)?)?$/i.test(label)) return '';
    if (/^mode-?[a-f0-9]{8,}$/i.test(label) || /^roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^repeating_[^.]+\.roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^[A-Za-z0-9_$-]+_(?:check|roll|attack|damage|u)$/i.test(label)) return '';
    return label;
  }

  function contractRolls(characterId, inspection, objects, includeHidden, readLive) {
    inspection = inspection || inspectContracts(characterId, objects);
    if (!inspection || inspection.status !== 'matched') return [];
    var contract = inspection.contract;
    var attributes = objects || attrObjects(characterId);
    var index = contractRuntimeIndex(contract);
    var attributeValues = dictionary();
    var readCache = dictionary();
    readLive = readLive || cachedAttrReader(characterId);
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeValues[name] = { current: attribute.get('current'), max: attribute.get('max') };
    });
    function read(name, type) {
      var key = name + '|' + type;
      if (own(readCache, key)) return readCache[key];
      if (attributeValues[name]) readCache[key] = attributeValues[name][type];
      else readCache[key] = readLive(name, type);
      return readCache[key];
    }
    var rowsBySection = dictionary();
    Object.keys(index.sections).forEach(function (sectionName) {
      var sourcePrefix = 'repeating_' + sectionName + '_';
      var prefixes = [sourcePrefix].concat(index.prefixes.filter(function (prefix) {
        return prefix !== sourcePrefix && index.prefixSections[prefix] === sectionName;
      }));
      var rows = [];
      prefixes.forEach(function (prefix) {
        var physicalSection = prefix.substring(10, prefix.length - 1);
        rows = rows.concat(collectRows(characterId, physicalSection, index.sections[sectionName], attributes, index.prefixes));
      });
      var rowPrefixes = dictionary();
      var conflicts = dictionary();
      rows.forEach(function (row) {
        if (own(rowPrefixes, row.id) && rowPrefixes[row.id] !== row.prefix) conflicts[row.id] = true;
        rowPrefixes[row.id] = row.prefix;
      });
      // 실행 주소에는 prefix가 없으므로 서로 다른 물리 그룹의 같은 ID는 선택하지 않습니다.
      rowsBySection[sectionName] = rows.filter(function (row) { return !conflicts[row.id]; });
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
      if (roll.visibility && roll.visibility.never === true) return;
      var repeating = contractRepeating(roll);
      var rows = repeating && repeating.section
        ? rowsBySection[repeating.section] || []
        : [null];
      rows.forEach(function (row) {
        var scopedControls = index.rollControls[roll.key] || dictionary();
        function readVisibility(name, atom) {
          if (index.presentationRollGates[name] && !atom.required) return { known: false };
          var scope = trim(atom && atom.scope).toLowerCase();
          if (scope === 'row' && !row) return { known: false };
          var fullName = scope === 'global' ? name : contractRowAttr(contract, roll, row, name);
          var control = scope === 'global' ? index.controls[name] : scopedControls[name] || index.controls[name];
          var hasValue = own(attributeValues, fullName);
          var liveValue = hasValue ? attributeValues[fullName].current : read(fullName, 'current');
          hasValue = hasValue || liveValue !== undefined && liveValue !== null && String(liveValue) !== '';
          if (hasValue) {
            var options = contractOptionValues(control);
            var validatesOptions = options.length > 1 ||
              /^(?:select|radio)$/i.test(trim(control && control.type));
            if (!validatesOptions || !options.length || options.indexOf(String(liveValue)) > -1)
              return { known: true, value: liveValue };
            return control && own(control, 'default')
              ? { known: true, value: control.default }
              : { known: false };
          }
          return control && own(control, 'default')
            ? { known: true, value: control.default }
            : { known: false };
        }
        var visibility = contractVisibilityResult(roll.visibility, readVisibility);
        // Explicit bonus/private modes may use hidden dice buttons, never an inactive worker panel.
        if (contractVisibilityResult(roll.visibility, function (name, atom) {
          return atom.required ? readVisibility(name, atom) : { known: false };
        }) === false) return;
        if (visibility === false && !includeHidden) return;
        var rawVisible = trim(roll.label);
        var visible = contractDisplayLabel(rawVisible);
        if (visible && roll.name && normalize(visible) === normalize(roll.name)) visible = '';
        var staticLabels = contractStaticLabels(roll);
        if (!visible && rawVisible && !repeating) {
          var sourceGroups = dictionary();
          String(roll.raw || '').replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (match, name) {
            var field = index.fieldGlobal[name];
            var group = contractDisplayLabel(field && field.numericCandidate ? field.groupLabel : '');
            if (group) sourceGroups[normalize(group)] = group;
            return match;
          });
          var sourceGroupKeys = Object.keys(sourceGroups);
          if (sourceGroupKeys.length === 1) visible = sourceGroups[sourceGroupKeys[0]];
        }
        var dynamic = [];
        var expressionNames = (Array.isArray(roll.expressionRefs) ? roll.expressionRefs : []).map(contractRefName);
        var titleRefs = dictionary();
        var sourceTitleLabels = dictionary();
        var sectionFields = repeating && index.fieldSections[repeating.section] || dictionary();
        var titleValue = '';
        var expressionLabels = [];
        (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
          var refName = contractRefName(ref);
          var sourceField = sectionFields[refName] || index.fieldGlobal[refName] || scopedControls[refName];
          if (expressionNames.indexOf(refName) < 0 && sourceField &&
            /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
            /^(?:text|textarea)$/i.test(trim(sourceField.type)) && !sourceField.hidden &&
            !sourceField.readonly && !sourceField.disabled && !trim(sourceField.default) &&
            // ponytail: 이름칸은 굴림 4개까지만; 더 공유하면 상한 확대.
            (index.labelRefFrequency[refName] || 0) <= 4) {
            var fieldLabels = [sourceField.label].concat(sourceField.aliases || []).map(normalize).filter(Boolean);
            var rawKey = normalize(rawVisible).replace(/(?:name|check|roll)$/i, '');
            var refKey = normalize(refName).replace(/(?:name|check|roll)$/i, '');
            var machineNamed = (normalize(rawVisible) === normalize(roll.name) || normalize(rawVisible) === normalize(roll.key)) &&
              rawKey && refKey && (rawKey.indexOf(refKey) > -1 || refKey.indexOf(rawKey) > -1);
            var editableTitle = /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
              /(?:^|_)(?:name|title|label)(?:_|$)/i.test(refName);
            if (fieldLabels.indexOf(normalize(rawVisible)) > -1 || machineNamed || editableTitle) {
              titleRefs[refName] = true;
              fieldLabels.forEach(function (label) { sourceTitleLabels[label] = true; });
            }
          }
          if (expressionNames.indexOf(refName) > -1) {
            var sourceLabel = contractDisplayLabel(sourceField && sourceField.label);
            if (sourceLabel && normalize(sourceLabel) !== normalize(refName)) expressionLabels.push(sourceLabel);
            return;
          }
          var value = contractLabelRef(characterId, contract, roll, row, ref, read);
          if (titleRefs[refName] && value && !titleValue) titleValue = value;
          if (value) dynamic.push({
            value: value,
            frequency: index.labelRefFrequency[refName] || 0,
            title: !!titleRefs[refName],
            subject: /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
              sourceField && /^(?:text|textarea)$/i.test(trim(sourceField.type)),
          });
        });
        if (Object.keys(titleRefs).length) {
          if (!titleValue) return;
          rawVisible = '';
          visible = '';
          staticLabels = staticLabels.filter(function (label) { return !sourceTitleLabels[normalize(label)]; });
        }
        dynamic.sort(function (left, right) {
          return Number(!!right.title) - Number(!!left.title) || left.frequency - right.frequency;
        });
        var usefulDynamic = dynamic.filter(function (entry) { return normalize(entry.value) !== characterName; });
        var rowLabels = usefulDynamic.map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var subjectLabels = usefulDynamic.filter(function (entry) { return entry.subject; })
          .map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var displayLabels = (row && rowLabels.length ? rowLabels :
          !roll.name && !staticLabels.length && subjectLabels.length ? subjectLabels : [visible])
          .concat(staticLabels.map(contractDisplayLabel).filter(Boolean))
          .concat(expressionLabels)
          .concat(row ? [visible] : rowLabels)
          .map(trim).filter(Boolean);
        if (!displayLabels.length && expressionNames.length === 1) displayLabels.push('자유 주사위');
        var labels = displayLabels
          .concat([rawVisible])
          .concat((roll.aliases || []).filter(function (label) { return !sourceTitleLabels[normalize(label)]; }))
          .concat(staticLabels)
          .concat(expressionNames.length === 1 ? ['자유 주사위', expressionNames[0]] : [])
          .concat([roll.name, roll.key])
          .map(trim).filter(Boolean);
        var unique = dictionary();
        labels = labels.filter(function (label) {
          var key = normalize(label);
          if (!key || unique[key]) return false;
          unique[key] = true;
          return true;
        });
        result.push({
          characterId: characterId,
          contract: contract,
          roll: roll,
          row: row,
          key: roll.key + (row ? '@' + row.id : ''),
          label: displayLabels[0] || '',
          aliases: labels,
          modes: Array.isArray(roll.modes) ? roll.modes : [],
          hidden: visibility === false,
        });
      });
    });
    return result;
  }

  function actionableContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched') return scannedContractRolls(characterId, includeHidden);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    objects = objects || attrObjects(characterId);
    readLive = readLive || cachedAttrReader(characterId);
    var rolls = [];
    candidates.forEach(function (candidate) {
      rolls = rolls.concat(contractRolls(characterId, candidate, objects, includeHidden, readLive));
    });
    return rolls;
  }

  function contractFieldMatch(index, name) {
    if (index.fieldGlobal[name]) return { field: index.fieldGlobal[name], name: name, rowId: '' };
    var matches = triePrefixes(index.fieldPrefixes, name);
    for (var i = matches.length - 1; i >= 0; i -= 1) {
      var match = matches[i];
      var fieldName = matchedField(match.fields, name, match.prefix.length);
      if (!fieldName) continue;
      var suffix = '_' + fieldName;
      var rowId = name.substring(match.prefix.length, name.length - suffix.length);
      if (!rowId) continue;
      return {
        field: index.fieldSections[match.section][fieldName],
        name: name,
        rowId: rowId,
        section: match.section,
        prefix: match.prefix,
      };
    }
    return null;
  }

  function localFieldLabel(field) {
    var label = contractDisplayLabel(field && field.label);
    var group = contractDisplayLabel(field && field.groupLabel);
    if (!group) return label;
    var groupKey = normalize(group);
    var candidates = [label].concat(field && field.aliases || []).map(contractDisplayLabel);
    for (var index = 0; index < candidates.length; index += 1) {
      var key = normalize(candidates[index]);
      if (groupKey && key.indexOf(groupKey) === 0) key = key.slice(groupKey.length);
      else if (groupKey && key.slice(-groupKey.length) === groupKey) key = key.slice(0, -groupKey.length);
      if (/^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(key)) return '현재';
      if (/^(?:최대|maximum|max)(?:값|수치|점수|value|score)?$/i.test(key)) return '최대';
      if (/^(?:시작|초기|start|starting|initial)(?:값|수치|점수|value|score)?$/i.test(key)) return '시작';
      if (/^(?:45|80%|threshold|문턱값|기준값)$/i.test(key)) return '4/5';
    }
    return label;
  }

  function fieldChoiceLegend(value) {
    return /(?:^|\s)-?\d+(?:\.\d+)?\s*=\s*\S+/.test(trim(value));
  }

  function fieldRangeOnly(value) {
    return /^\(?\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)?$/i.test(trim(value));
  }

  function cleanFieldRange(value) {
    return trim(value).replace(/\s*\(\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)\s*$/i, '');
  }

  function fieldLabel(field, rowLabel) {
    var name = trim(field && field.name);
    var label = localFieldLabel(field) || name;
    var group = contractDisplayLabel(field && field.groupLabel);
    var role = normalize(label);
    var generic = /^(?:현재|최대|current|maximum|max|value|score|값|수치|점수)$/i;
    if (group && /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(role)) {
      var sourceLabel = contractDisplayLabel(field && field.label);
      label = /^(?:현재|current|now).+|.+(?:현재|current|now)$/i.test(normalize(sourceLabel)) &&
        normalize(sourceLabel) !== normalize(name) && !generic.test(normalize(sourceLabel))
        ? sourceLabel : group;
    }
    else if (group && /^(?:최대|maximum|max|시작|초기|start|starting|initial|45|80%|threshold|문턱값|기준값)(?:값|수치|점수|value|score)?$/i.test(role))
      label = /[가-힣]/.test(label) ? label + ' ' + group : group + ' ' + label;
    if (normalize(label) === normalize(name) || generic.test(normalize(label)) || fieldChoiceLegend(label)) {
      var preferred = (field && field.aliases || []).map(contractDisplayLabel).filter(function (alias) {
        return alias && normalize(alias) !== normalize(name) && !generic.test(normalize(alias)) &&
          !fieldChoiceLegend(alias) && !fieldRangeOnly(alias);
      })[0];
      if (preferred) label = cleanFieldRange(preferred);
    }
    if (rowLabel && normalize(rowLabel) !== normalize(label)) return rowLabel + ' / ' + label;
    return rowLabel || label;
  }

  function numericRadioField(field) {
    var range = field && field.radioRange;
    return !!field && field.type === 'radio' && field.numericCandidate &&
      Array.isArray(range) && range.length === 2 &&
      range.every(function (value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; }) &&
      range[0] <= range[1];
  }

  function userFacingField(field) {
    if (numericRadioField(field)) return true;
    var name = trim(field && field.name);
    var label = contractDisplayLabel(field && field.label);
    if (label && (normalize(label) !== normalize(name) || /[가-힣]/.test(name))) return true;
    return (field && field.aliases || []).some(function (alias) {
      return contractDisplayLabel(alias) && normalize(alias) !== normalize(name);
    });
  }

  function numericFieldValue(characterId, value, defaults, rowContext) {
    if (value === undefined || value === null || trim(value) === '') return null;
    var resolved = resolvedResourceValue(characterId, value, defaults, rowContext);
    return resolved.number === null || !isFinite(resolved.number) ? null : resolved.number;
  }

  function fieldAliases(field, label, rowLabel, fullName) {
    var seen = dictionary();
    return [label, rowLabel, localFieldLabel(field)]
      .concat(field && field.aliases || [])
      .concat([field && field.name, fullName])
      .map(trim).filter(function (alias) {
        var key = normalize(alias);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function fieldPairLabels(field, label, rowLabel) {
    var seen = dictionary();
    var group = contractDisplayLabel(field && field.groupLabel);
    var local = localFieldLabel(field);
    return [label, rowLabel, local, group, group && local ? group + ' ' + local : '', group && local ? local + ' ' + group : '']
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function sourceFieldLabels(field, label, rowLabel) {
    var seen = dictionary();
    return fieldPairLabels(field, label, rowLabel).concat(field && field.aliases || [])
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function maximumFieldLabel(labels) {
    return (labels || []).some(function (label) {
      return /^(?:최대|maximum|max)(?:값|수치|점수)?$/i.test(normalize(label)) ||
        /^(?:최대|maximum|max).+$/i.test(normalize(label));
    });
  }

  function fieldPairKeys(labels) {
    var ignored = {
      current: true, maximum: true, max: true, value: true, score: true,
      현재: true, 최대: true, 값: true, 수치: true, 점수: true,
    };
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(label);
      var stripped = key.replace(/^(?:현재|최대|current|maximum|max)/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || ignored[candidate] || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function fieldPairNameKey(name) {
    return normalize(name)
      .replace(/^(?:현재|최대|current|maximum|max|now)/i, '')
      .replace(/(?:현재|최대|current|maximum|max|now)$/i, '');
  }

  function pairResourceMaximums(resources, references) {
    var maximumByKey = dictionary();
    var maximumByName = dictionary();
    (references || []).forEach(function (candidate, index) {
      if (!maximumFieldLabel(candidate.sourceLabels)) return;
      var nameKey = fieldPairNameKey(candidate.name);
      if (nameKey) {
        if (!maximumByName[nameKey]) maximumByName[nameKey] = [];
        maximumByName[nameKey].push({ candidate: candidate, index: index });
      }
      fieldPairKeys(candidate.pairLabels).forEach(function (key) {
        if (!maximumByKey[key]) maximumByKey[key] = [];
        maximumByKey[key].push({ candidate: candidate, index: index });
      });
    });
    (resources || []).forEach(function (item) {
      if (item.max !== null || maximumFieldLabel(item.sourceLabels)) return;
      var scores = dictionary();
      var candidates = [];
      function score(entry, amount) {
        if (entry.candidate.name === item.name) return;
        if (!scores[entry.index]) candidates.push(entry);
        scores[entry.index] = (scores[entry.index] || 0) + amount;
      }
      fieldPairKeys(item.pairLabels).forEach(function (key) {
        (maximumByKey[key] || []).forEach(function (entry) {
          score(entry, 1);
        });
      });
      (maximumByName[fieldPairNameKey(item.name)] || []).forEach(function (entry) {
        score(entry, 1000);
      });
      var best = 0;
      var match = null;
      var matchCount = 0;
      candidates.forEach(function (entry) {
        var score = scores[entry.index];
        if (score < best) return;
        if (score > best) {
          best = score;
          match = entry.candidate;
          matchCount = 1;
        } else matchCount += 1;
      });
      if (matchCount === 1) {
        item.max = match.value;
        item._maxDefinition = match._definition || '';
      }
    });
  }

  function liveResourceFields(fields) {
    var result = dictionary();
    var maximums = dictionary();
    var maximumsByName = dictionary();
    (fields || []).filter(function (field) {
      return !field.section && !field.hidden &&
        /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) &&
        maximumFieldLabel(sourceFieldLabels(field, fieldLabel(field, ''), ''));
    }).forEach(function (field) {
      var nameKey = fieldPairNameKey(field.name);
      if (nameKey) {
        if (!maximumsByName[nameKey]) maximumsByName[nameKey] = [];
        maximumsByName[nameKey].push(field);
      }
      fieldPairKeys(fieldPairLabels(field, localFieldLabel(field), '')).forEach(function (key) {
        if (!maximums[key]) maximums[key] = [];
        maximums[key].push(field);
      });
    });
    (fields || []).forEach(function (field) {
      if (field.section || field.hidden || field.readonly || field.disabled || !field.numericCandidate ||
        !userFacingField(field) || !(numericRadioField(field) || /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()))) return;
      if (numericRadioField(field)) result[field.name] = true;
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), '');
      var labels = sourceFieldLabels(field, fieldLabel(field, ''), '').concat(field.name);
      if (trim(field.max) && ['health', 'sanity', 'magicPoints'].some(function (role) {
        return matchesDetectedRole(labels, role);
      })) result[field.name] = true;
      var keys = fieldPairKeys(pairLabels);
      var namedMaximums = maximumsByName[fieldPairNameKey(field.name)] || [];
      if (namedMaximums.length === 1 && namedMaximums[0] !== field) {
        result[field.name] = true;
        result[namedMaximums[0].name] = true;
      }
      keys.forEach(function (key) {
        var matches = (maximums[key] || []).filter(function (maximum) { return maximum !== field; });
        if (matches.length !== 1) return;
        result[field.name] = true;
        result[matches[0].name] = true;
      });
    });
    return result;
  }

  function contractUnsavedFieldValue(field, live, fallback, maximum) {
    var variants = !maximum && Array.isArray(field && field.defaultVariants) ? field.defaultVariants : [];
    if (variants.length) fallback = variants[0];
    if (live !== undefined && live !== null && trim(live) !== '') {
      var hiddenDefault = variants.slice(1).some(function (value) {
        return trim(value) === trim(live);
      });
      if (!hiddenDefault) return live;
    }
    return fallback;
  }

  function contractFieldItems(characterId, inspection, objects, rolls, readLive, includeDefinition) {
    var result = { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    if (!inspection || inspection.status !== 'matched') return result;
    var fields = Array.isArray(inspection.contract.fields) ? inspection.contract.fields : [];
    if (!fields.length) return result;
    var index = contractRuntimeIndex(inspection.contract);
    var liveFields = liveResourceFields(fields);
    var fieldDefaults = dictionary();
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      if (own(field, 'default') && trim(field.default) !== '') fieldDefaults[field.name] = field.default;
      else if (trim(field.type).toLowerCase() === 'checkbox') fieldDefaults[field.name] = '0';
    });
    readLive = readLive || cachedAttrReader(characterId);
    var attributes = objects || attrObjects(characterId);
    var attributeByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeByName[name] = attribute;
    });
    var rowLabels = dictionary();
    (rolls || []).forEach(function (instance) {
      var repeating = instance.roll && contractRepeating(instance.roll);
      if (!instance.row || !repeating) return;
      var section = trim(repeating.section);
      var key = (instance.row.prefix || 'repeating_' + section + '_') + '|' + instance.row.id;
      if (!rowLabels[key] && trim(instance.label)) rowLabels[key] = trim(instance.label);
    });
    function fieldVisibility(match) {
      var condition = match.field && match.field.visibility;
      if (!condition) return true;
      return contractVisibilityResult(condition, function (name, atom) {
        var scope = trim(atom && atom.scope).toLowerCase();
        var fullName = name;
        if (scope !== 'global' && match.section && match.rowId)
          fullName = match.prefix + match.rowId + '_' + name;
        if (attributeByName[fullName])
          return { known: true, value: attributeByName[fullName].get('current') };
        var live = readLive(fullName, 'current');
        if (live !== undefined && live !== null && String(live) !== '')
          return { known: true, value: live };
        var sourceField = match.section && index.fieldSections[match.section]
          ? index.fieldSections[match.section][name]
          : index.fieldGlobal[name];
        if (sourceField && own(sourceField, 'default'))
          return { known: true, value: sourceField.default };
        var control = index.controls[name];
        return control && own(control, 'default')
          ? { known: true, value: control.default }
          : { known: false };
      });
    }
    function fieldRowContext(match) {
      if (!match.section || !match.rowId) return null;
      var fields = index.fieldSections[match.section] || dictionary();
      var prefix = match.prefix + match.rowId + '_';
      var values = dictionary();
      Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var fullName = prefix + name;
        var attribute = attributeByName[fullName];
        var current = attribute ? attribute.get('current') : undefined;
        var maximum = attribute ? attribute.get('max') : undefined;
        if (attribute) {
          if ((current === undefined || trim(current) === '') && own(field, 'default')) current = field.default;
          if ((maximum === undefined || trim(maximum) === '') && trim(field.max)) maximum = field.max;
        } else {
          current = contractUnsavedFieldValue(field, readLive(fullName, 'current'), field.default, false);
          var liveMaximum = readLive(fullName, 'max');
          maximum = liveMaximum !== undefined && liveMaximum !== null && trim(liveMaximum) !== ''
            ? liveMaximum : field.max;
        }
        if (current !== undefined && trim(current) !== '') values[fullName + '|current'] = current;
        if (maximum !== undefined && trim(maximum) !== '') values[fullName + '|max'] = maximum;
      });
      return { scopes: [prefix], fields: fields, values: values };
    }
    function sourceFieldValue(name, valueType) {
      var attribute = attributeByName[name];
      if (attribute) return attribute.get(valueType === 'max' ? 'max' : 'current');
      var field = index.fieldGlobal[name];
      var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
      var live = readLive(name, valueType);
      if (valueType !== 'max' && field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled)
        return contractUnsavedFieldValue(field, live, fallback, false);
      return live !== undefined && live !== null && trim(live) !== '' ? live : fallback;
    }
    var valueContext = { scopes: [], values: dictionary(), resolveAttribute: sourceFieldValue };
    function add(match, attribute, fallback) {
      var field = match.field;
      if (!userFacingField(field)) return;
      var visible = fieldVisibility(match);
      if (visible === false) return;
      var fullName = match.name;
      var raw = attribute ? attribute.get('current') : fallback;
      var rowLabel = match.section ? rowLabels[match.prefix + '|' + match.rowId] || '' : '';
      var label = fieldLabel(field, rowLabel);
      var aliases = fieldAliases(field, label, rowLabel, fullName);
      var type = trim(field.type).toLowerCase();
      var sourceLabels = sourceFieldLabels(field, label, rowLabel);
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), rowLabel);
      var rowContext = fieldRowContext(match) || valueContext;
      rowContext.resolveAttribute = sourceFieldValue;
      var localLabel = localFieldLabel(field);
      var statusResource = !!liveFields[fullName] &&
        !/^(?:최대|시작|초기|maximum|max|start|starting|initial|45|80%|threshold|문턱값|기준값)/i.test(normalize(localLabel));
      var definition = includeDefinition ? JSON.stringify(field) : '';
      var structure = includeDefinition ? JSON.stringify([
        type, trim(field.section), !!field.numericCandidate, !!field.trackCandidate,
        !!field.readonly, !!field.disabled, !!field.hidden, trim(field.default), trim(field.max), trim(field.onValue),
        field.defaultVariants || [], field.radioRange || [],
      ]) : '';
      var number = (numericRadioField(field) || /^(?:text|number|range)$/.test(type))
        ? numericFieldValue(characterId, raw, fieldDefaults, rowContext) : null;
      var tracked = !index.presentationControls[field.name] && !!field.trackCandidate &&
        (number !== null || type === 'checkbox');
      if (tracked) result.tracked[fullName] = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        kind: type === 'checkbox' ? 'toggle' : 'number',
        onValue: trim(field.onValue),
        value: raw,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
      };
      if (tracked && numericRadioField(field)) result.tracked[fullName].radioRange = field.radioRange.slice();
      if (number === null) return;
      // A literal HTML input limit is not the character's resource maximum.
      var sourceMaximum = /@\{[^}]+\}/.test(trim(field.max)) ? field.max : '';
      var maxRaw = attribute && attribute.get('max');
      if (trim(maxRaw) === '' && sourceMaximum) {
        var liveMax = readLive(fullName, 'max');
        if (liveMax !== undefined && liveMax !== null && trim(liveMax) !== '') maxRaw = liveMax;
      }
      if (trim(maxRaw) === '') maxRaw = sourceMaximum;
      var item = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        value: number,
        max: numericFieldValue(characterId, maxRaw, fieldDefaults, rowContext),
        writable: !!field.numericCandidate,
        statusResource: statusResource,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
        _maxDefinition: sourceMaximum ? JSON.stringify(sourceMaximum) : '',
      };
      if (numericRadioField(field)) item.radioRange = field.radioRange.slice();
      result.references.push(item);
      if (!field.numericCandidate) return;
      result.resources.push(item);
      result.byAttribute[fullName] = item;
      aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!result.aliases[key]) result.aliases[key] = [];
        result.aliases[key].push(item);
      });
    }
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      var name = trim(field.name);
      var attribute = attributeByName[name];
      if (attribute) add({ field: field, name: name, rowId: '' }, attribute);
      else if (!field.hidden && field.trackCandidate && trim(field.type).toLowerCase() === 'checkbox')
        add({ field: field, name: name, rowId: '' }, null, field.default);
      else if (!field.hidden && (numericRadioField(field) || /^(?:text|number|range)$/.test(trim(field.type).toLowerCase())) && own(field, 'default')) {
        var fallback = field.default;
        if (liveFields[name]) {
          var live = readLive(name, 'current');
          fallback = contractUnsavedFieldValue(field, live, fallback, false);
        }
        add({ field: field, name: name, rowId: '' }, null, fallback);
      }
    });
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (index.fieldGlobal[name]) return;
      var match = contractFieldMatch(index, name);
      if (match && match.section) add(match, attribute);
    });
    pairResourceMaximums(result.resources, result.references);
    result.resources.sort(function (left, right) {
      return left.label.localeCompare(right.label) || left.name.localeCompare(right.name);
    });
    return result;
  }

  function contractFieldItemFingerprint(item) {
    return JSON.stringify([
      item.name, item._structure || '', item.kind || '', trim(item.onValue),
      item.writable !== false, item.automationVisible === true,
    ]);
  }

  function commonContractFieldItems(characterId, inspection, objects, rolls, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractFieldItems(characterId, inspection, objects, rolls, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length)
      return { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    var results = candidates.map(function (candidate) {
      return contractFieldItems(
        characterId,
        candidate,
        objects,
        contractRolls(characterId, candidate, objects, false, readLive),
        readLive,
        true,
      );
    });
    function shared(property, dictionaryProperty) {
      var lists = results.map(function (result) {
        return dictionaryProperty
          ? Object.keys(result[property] || {}).map(function (name) { return result[property][name]; })
          : result[property] || [];
      });
      var indexes = lists.slice(1).map(function (items) {
        var found = dictionary();
        items.forEach(function (item) { found[contractFieldItemFingerprint(item)] = item; });
        return found;
      });
      return (lists[0] || []).filter(function (item) {
        var key = contractFieldItemFingerprint(item);
        return indexes.every(function (index) { return !!index[key]; });
      }).map(function (item) {
        var key = contractFieldItemFingerprint(item);
        var peers = [item].concat(indexes.map(function (index) { return index[key]; }));
        var merged = merge({}, item);
        ['aliases', 'sourceLabels'].forEach(function (property) {
          var seen = dictionary();
          merged[property] = [];
          peers.forEach(function (peer) {
            (peer[property] || []).forEach(function (value) {
              var normalized = normalize(value);
              if (!normalized || seen[normalized]) return;
              seen[normalized] = true;
              merged[property].push(value);
            });
          });
        });
        if (!own(item, 'max')) return merged;
        merged.max = peers.every(function (peer) {
          return peer.max === item.max;
        }) ? item.max : null;
        return merged;
      });
    }
    var value = {
      resources: shared('resources'),
      tracked: dictionary(),
      aliases: dictionary(),
      byAttribute: dictionary(),
      references: shared('references'),
    };
    pairResourceMaximums(value.resources, value.references);
    shared('tracked', true).forEach(function (item) { value.tracked[item.name] = item; });
    value.resources.forEach(function (item) {
      value.byAttribute[item.name] = item;
      item.aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!value.aliases[key]) value.aliases[key] = [];
        value.aliases[key].push(item);
      });
    });
    return value;
  }

  function invalidate(characterId) {
    if (characterId) {
      delete cache[characterId];
      delete attributeObjectCache[characterId];
    } else {
      cache = {};
      attributeObjectCache = {};
      contractMatchCache = {};
    }
  }

  function scan(characterId, force) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    if (!force && cache[characterId] && cache[characterId].characterName === trim(character.get('name')))
      return cache[characterId];
    var objects = attrObjects(characterId);
    attributeObjectCache[characterId] = objects;
    var contractMatch = contractMatchCache[characterId] || inspectContracts(characterId, objects);
    var value = {};
    value.warnings = [];
    value.ok = true;
    value.profileId = 'sheet';
    value.score = contractMatch.match && contractMatch.match.score || 0;
    value.matched = contractMatch.status === 'matched';
    value.characterId = characterId;
    value.characterName = trim(character.get('name'));
    value.contractMatch = contractMatch;
    value.attributeByName = dictionary();
    objects.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) value.attributeByName[name] = attribute;
    });
    var readLive = cachedAttrReader(characterId);
    value.contractAllRolls = commonContractRolls(characterId, value.contractMatch, true, objects, readLive);
    value.contractRolls = value.contractAllRolls.filter(function (instance) { return !instance.hidden; });
    var fields = commonContractFieldItems(characterId, value.contractMatch, objects, value.contractRolls, readLive);
    value.resources = fields.resources;
    value.trackedFields = fields.tracked;
    value.resourceAliases = fields.aliases;
    value.resourcesByAttribute = fields.byAttribute;
    value.fieldReferences = fields.references;
    cache[characterId] = value;
    return value;
  }

  function scannedContractRolls(characterId, includeHidden) {
    var data = scan(characterId);
    return (includeHidden ? data.contractAllRolls : data.contractRolls) || [];
  }

  function preferredContractRolls(data) {
    // 일반/보너스 짝을 먼저 고른 뒤 시트 후보 간 동등화를 해야 짝이 유실되지 않습니다.
    var instances = actionableContractRolls(data.characterId, data.contractMatch, false);
    var preferred = dictionary();
    collapseEquivalentContractCandidates(data.characterId, preferSingleInlineRollActions(
      uniqueContractCandidates(instances.map(function (instance) {
        return { instance: instance };
      })),
    )).forEach(function (candidate) {
      preferred[candidate.instance.contract.id + '|' + candidate.instance.key] = true;
    });
    return instances.filter(function (instance) {
      return preferred[instance.contract.id + '|' + instance.key];
    });
  }

  var DETECTED_ROLE_LABELS = {
    health: ['체력', 'hp', 'hitpoint', 'hitpoints'],
    sanity: ['이성', 'san', 'sanity'],
    magicPoints: ['마력', 'mp', 'magicpoint', 'magicpoints', 'mana'],
    startingSanity: ['시작이성', '초기이성', 'startingsanity', 'initialsanity'],
    majorWound: ['중상', 'majorwound'],
    dying: ['빈사', 'dying'],
    longInsanity: ['장기', '장기광기', '장기적광기', 'indefiniteinsanity', 'indefinsane'],
    temporaryInsanity: ['일시', '일시광기', '일시적광기', '단기광기', 'temporaryinsanity', 'tempinsane'],
    intelligence: ['지능', 'int', 'intelligence'],
    characteristic: [
      '근력', 'str', 'strength', '건강', 'con', 'constitution', '크기', 'siz', 'size',
      '민첩', '민첩성', 'dex', 'dexterity', '외모', 'app', 'appearance',
      '지능', 'int', 'intelligence', '정신', '정신력', 'pow', 'power', '교육', 'edu', 'education',
    ],
  };

  function detectedLabelKeys(labels) {
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(contractDisplayLabel(label));
      var stripped = key
        .replace(/^(?:현재|current)/i, '')
        .replace(/(?:현재|current|값|수치|점수|value|score|체크|check|굴림|roll|판정)$/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function matchesDetectedRole(labels, role) {
    var wanted = DETECTED_ROLE_LABELS[role] || [];
    return detectedLabelKeys(labels).some(function (key) { return wanted.indexOf(key) > -1; });
  }

  function uniqueDetectedItems(items, role) {
    function collect(useToggleAliases) {
      var seen = dictionary();
      return (items || []).filter(function (item) {
        var labels = item && item.kind === 'toggle' && item.fieldLabel && !useToggleAliases
          ? [item.fieldLabel] : item && item.sourceLabels;
        if (!item || item.automationVisible !== true || !matchesDetectedRole(labels, role) || seen[item.name]) return false;
        seen[item.name] = true;
        return true;
      });
    }
    var matches = collect(false);
    if (!matches.length && (items || []).some(function (item) { return item && item.kind === 'toggle'; }))
      matches = collect(true);
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function linkedStartingSanityField(item, sanityName, labels) {
    var starting = detectedLabelKeys(labels).some(function (key) {
      return /^(?:시작|초기|starting|initial|start)(?:값|수치|점수|value|score)?$/i.test(key);
    });
    var candidateKey = fieldPairNameKey(item && item.name)
      .replace(/^(?:starting|initial|start|시작|초기)/i, '')
      .replace(/(?:starting|initial|start|시작|초기)$/i, '');
    return starting && candidateKey && candidateKey === fieldPairNameKey(sanityName);
  }

  function detectedFieldRole(data, role, kind) {
    var items = kind === 'toggle'
      ? Object.keys(data.trackedFields || {}).map(function (name) { return data.trackedFields[name]; })
        .filter(function (item) { return item.kind === 'toggle'; })
      : (data.resources || []).filter(function (item) {
          return role === 'startingSanity' ||
            !maximumFieldLabel(item.sourceLabels) &&
            !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
        });
    var detected = uniqueDetectedItems(items, role);
    if (role !== 'startingSanity' || detected.matches.length) return detected;
    var sanity = uniqueDetectedItems((data.resources || []).filter(function (item) {
      return !maximumFieldLabel(item.sourceLabels) &&
        !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
    }), 'sanity');
    if (!sanity.item) return detected;
    var seen = dictionary();
    var matches = items.filter(function (item) {
      if (!item || item.automationVisible !== true || seen[item.name] ||
        !linkedStartingSanityField(item, sanity.item.name, item.sourceLabels)) return false;
      seen[item.name] = true;
      return true;
    });
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function detectedRollLabels(instance) {
    return [instance && instance.label, instance && instance.roll && instance.roll.label]
      .concat(instance && instance.roll && instance.roll.aliases || [])
      .concat((instance && instance.roll && instance.roll.staticLabels || []).map(function (entry) {
        return entry && entry.value;
      }));
  }

  function neutralSourceRoll(instance) {
    var roll = instance && instance.roll;
    if (!roll || (Array.isArray(instance.modes) && instance.modes.length)) return false;
    var diceFields = 0;
    String(roll.raw || '').replace(/\{\{\s*[^={}]+?\s*=\s*([^}]*)\}\}/g, function (token, value) {
      if (/\[\[[\s\S]*?\b\d*d\d+/i.test(value)) diceFields += 1;
      return token;
    });
    if (diceFields !== 1) return false;
    var template = instance.contract && instance.contract.resultTemplates &&
      instance.contract.resultTemplates[roll.template];
    var groups = dictionary();
    (template && Array.isArray(template.rules) ? template.rules : []).forEach(function (rule) {
      if (rule && own(rule, 'group')) groups[String(rule.group)] = true;
    });
    return Object.keys(groups).length <= 1;
  }

  function detectedRollRole(data, role) {
    var seen = dictionary();
    var rolls = preferredContractRolls(data);
    var matches = rolls.filter(function (instance) {
      var key = instance && instance.key;
      if (!key || seen[key] || !matchesDetectedRole(detectedRollLabels(instance), role)) return false;
      seen[key] = true;
      return true;
    });
    if (!matches.length) {
      var field = detectedFieldRole(data, role, 'resource');
      var namedFields = (data.resources || []).filter(function (item) {
        return item.automationVisible === true && matchesDetectedRole([item.name], role);
      });
      var name = field.item && field.item.name || (namedFields.length === 1 && namedFields[0].name);
      seen = dictionary();
      if (name) matches = rolls.filter(function (instance) {
        var key = instance && instance.key;
        var references = false;
        String(instance && instance.roll && instance.roll.raw || '').replace(
          /@\{([^{}|]+)(?:\|max)?\}/g,
          function (token, sourceName) {
            if (contractRowAttr(instance.contract, instance.roll, instance.row, trim(sourceName)) === name)
              references = true;
            return token;
          },
        );
        if (!key || seen[key] || !references) return false;
        seen[key] = true;
        return true;
      });
    }
    matches = preferSingleInlineRollActions(matches.map(function (instance) {
      return { instance: instance };
    })).map(function (candidate) { return candidate.instance; });
    if (matches.length > 1) {
      var neutral = matches.filter(neutralSourceRoll);
      if (neutral.length === 1) matches = neutral;
    }
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

 function canControl(character, playerId) {
    if (!character) return false;
    if (playerId === 'API' || playerIsGM(playerId)) return true;
    var controlled = trim(character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    return controlled.indexOf('all') > -1 || controlled.indexOf(playerId) > -1;
  }

  function hasPlayerController(character) {
    return trim(character && character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean)
      .some(function(id){return id==='all'||getObj('player',id)&&!playerIsGM(id);});
  }

  function profileCharacters() {
    return characterObjects().filter(function (character) {
      return usableContractInspection(inspectContracts(character.id));
    });
  }

  function resolveCharacterName(query, characters) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '캐릭터 이름을 입력해 주세요.' };
    characters = characters || profileCharacters();
    var exact = characters.filter(function (character) {
      return normalize(character.get('name')) === wanted;
    });
    if (exact.length === 1) return { ok: true, character: exact[0] };
    var partial = characters.filter(function (character) {
      return normalize(character.get('name')).indexOf(wanted) > -1;
    });
    if (partial.length === 1) return { ok: true, character: partial[0] };
    if (partial.length > 1)
      return {
        ok: false,
        error: '이름이 비슷한 캐릭터가 여러 명입니다: ' + partial.map(function (character) {
          return trim(character.get('name'));
        }).join(', '),
      };
    return { ok: false, error: '이름에 ' + trim(query) + '이(가) 들어간 캐릭터를 찾지 못했습니다.' };
  }

  function resolveCharacter(msg, explicitId) {
    if (!explicitId && msg && own(msg, '_kibSheetResolvedCharacter'))
      return msg._kibSheetResolvedCharacter;
    var resolved = resolveCharacterNow(msg, explicitId);
    if (!explicitId && msg) msg._kibSheetResolvedCharacter = resolved;
    return resolved;
  }

  function speakingCharacter(msg) {
    var player = getObj('player', msg && msg.playerid);
    var match = trim(player && player.get('speakingas')).match(/^character\|(.+)$/i);
    if (!match)
      return { ok: false, error: '채팅 입력창의 As를 사용할 캐릭터로 바꾼 뒤 다시 입력해 주세요.' };
    var character = getObj('character', match[1]);
    if (!character) return { ok: false, error: '현재 As 캐릭터를 찾지 못했습니다.' };
    return canControl(character, msg.playerid)
      ? { ok: true, character: character }
      : { ok: false, error: '현재 As 캐릭터를 조작할 권한이 없습니다.' };
  }

  function resolveCharacterNow(msg, explicitId) {
    if (explicitId) {
      var direct = getObj('character', explicitId);
      if (!direct) return { ok: false, error: '버튼에 기록된 캐릭터를 찾지 못했습니다.' };
      if (!canControl(direct, msg.playerid))
        return { ok: false, error: '이 캐릭터를 조작할 권한이 없습니다.' };
    }
    var speaking = speakingCharacter(msg);
    if (!speaking.ok) return speaking;
    if (explicitId && speaking.character.id !== explicitId)
      return { ok: false, error: '현재 As 캐릭터와 버튼에 기록된 캐릭터가 다릅니다. 현재 As의 현황을 다시 열어 주세요.' };
    return speaking;
  }

  function resolveInspectionCharacter(msg) {
    if (playerIsGM(msg.playerid)) {
      var managed = getObj('character', initState().managerCharacterId);
      if (managed) return { ok: true, character: managed };
    }
    return resolveCharacter(msg, '');
  }

  function ensureSheet(character) {
    var contractMatch = inspectContracts(character.id);
    if (!usableContractInspection(contractMatch))
      return {
        ok: false,
        error: contractMatch.error || SHEET_NOT_RECOGNIZED,
      };
    return { ok: true, data: scan(character.id) };
  }

  var OUTCOMES = {
    roll: '판정 실행',
    critical: '대성공',
    extreme: '극단적 성공',
    hard: '어려운 성공',
    success: '보통 성공',
    failure: '실패',
    fumble: '대실패',
  };

  function resultKey(system, label) {
    return normalize(system) + ':' + encodeURIComponent(normalize(label));
  }

  function contractCutinKey(instance) {
    return resultKey('sheet', instance.key);
  }

  function templateValue(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var match = content.match(new RegExp('\\{\\{\\s*' + escaped + '\\s*=\\s*([^}]*)\\}\\}', 'i'));
    if (!match) return null;
    var value = trim(match[1]);
    if (!value) return null;
    var inline = value.match(/^\$\[\[(\d+)\]\]$/);
    if (inline) {
      var roll = message.inlinerolls && message.inlinerolls[Number(inline[1])];
      var total = roll && roll.results && Number(roll.results.total);
      return isFinite(total) ? total : null;
    }
    var number = Number(value.replace(/^\[\[|\]\]$/g, ''));
    return isFinite(number) ? number : null;
  }

  function templateHasField(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\{\\{\\s*' + escaped + '\\s*=', 'i').test(content);
  }

  function contractResultMode(message, payload) {
    var mode = 'normal';
    var modeLabel = normalize(payload && payload.modeLabel);
    if (/(?:보너스|bonus).*2/.test(modeLabel)) mode = 'bonus2';
    else if (/(?:보너스|bonus).*1/.test(modeLabel)) mode = 'bonus1';
    else if (/(?:패널티|페널티|penalty).*2/.test(modeLabel)) mode = 'penalty2';
    else if (/(?:패널티|페널티|penalty).*1/.test(modeLabel)) mode = 'penalty1';
    var diceType = templateValue(message, 'dice_type');
    if (mode === 'normal') {
      if (diceType === 1) mode = 'bonus1';
      else if (diceType === 2) mode = 'bonus2';
      else if (diceType === -1) mode = 'penalty1';
      else if (diceType === -2) mode = 'penalty2';
    }
    return mode;
  }

  function sourceResultTemplateForContract(contract, key) {
    if (!contract || !contract.resultTemplates) return null;
    var roll = contractRuntimeIndex(contract).rollsByKey[String(key)];
    if (!roll || !roll.template) return null;
    if (contract.resultTemplates[roll.template]) return contract.resultTemplates[roll.template];
    var wanted = normalize(roll.template);
    var names = Object.keys(contract.resultTemplates);
    for (var index = 0; index < names.length; index += 1) {
      if (normalize(names[index]) === wanted) return contract.resultTemplates[names[index]];
    }
    return null;
  }

  function sourceResultTemplate(payload) {
    if (!payload || !payload.contractId || !payload.key) return null;
    var contracts = sheetContracts();
    for (var i = 0; i < contracts.length; i += 1) {
      var contract = contracts[i];
      if (String(contract.id) === String(payload.contractId))
        return sourceResultTemplateForContract(contract, payload.key);
    }
    return null;
  }

  function sourceResultOperand(message, value) {
    var raw = trim(value);
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(raw)) return Number(raw);
    return templateValue(message, raw);
  }

  function sourceResultCondition(message, condition) {
    if (!condition || !Array.isArray(condition.args) || !condition.args.length) return false;
    var matched = false;
    if (condition.op === 'present') matched = templateHasField(message, condition.args[0]);
    else {
      var left = sourceResultOperand(message, condition.args[0]);
      if (left === null) matched = false;
      else if (condition.op === 'eq') {
        var right = sourceResultOperand(message, condition.args[1]);
        matched = right !== null && left === right;
      } else if (condition.op === 'gt') {
        var greater = sourceResultOperand(message, condition.args[1]);
        matched = greater !== null && left > greater;
      } else if (condition.op === 'lt') {
        var less = sourceResultOperand(message, condition.args[1]);
        matched = less !== null && left < less;
      } else if (condition.op === 'between') {
        var lower = sourceResultOperand(message, condition.args[1]);
        var upper = sourceResultOperand(message, condition.args[2]);
        matched = lower !== null && upper !== null && left >= lower && left <= upper;
      }
    }
    return condition.not ? !matched : matched;
  }

  function sourceResultGroupMatches(group, mode) {
    var expected = mode === 'bonus2' ? '+2'
      : mode === 'bonus1' ? '+1'
        : mode === 'penalty2' ? '-2'
          : mode === 'penalty1' ? '-1'
            : '0';
    return String(group) === expected;
  }

  function sourceContractResult(message, payload, mode) {
    var template = sourceResultTemplate(payload);
    var rules = template && Array.isArray(template.rules) ? template.rules : [];
    if (!rules.length) return null;
    var grouped = rules.some(function (rule) { return own(rule, 'group'); });
    for (var i = 0; i < rules.length; i += 1) {
      var rule = rules[i];
      if (!rule || !OUTCOMES[rule.outcome] || !Array.isArray(rule.conditions)) continue;
      if (grouped && (!own(rule, 'group') || !sourceResultGroupMatches(rule.group, mode))) continue;
      if (!rule.conditions.every(function (condition) { return sourceResultCondition(message, condition); })) continue;
      var total = templateValue(message, rule.valueField);
      if (total === null) continue;
      return { total: total, outcome: rule.outcome, outcomeLabel: OUTCOMES[rule.outcome] };
    }
    return null;
  }

 function contractResult(message, payload) {
    var target = templateValue(message, 'success');
    var hard = templateValue(message, 'hard');
    var extreme = templateValue(message, 'extreme');
    var critical = templateValue(message, 'critical');
    var fumble = templateValue(message, 'fumble');
    var mode = contractResultMode(message, payload);
    var sourceOutcome = sourceContractResult(message, payload, mode);
    if (sourceOutcome) {
      sourceOutcome.target = target;
      sourceOutcome.hard = hard;
      sourceOutcome.extreme = extreme;
      sourceOutcome.mode = mode;
      return sourceOutcome;
    }
    var roll1 = templateValue(message, 'roll1');
    var roll2 = templateValue(message, 'roll2');
    var roll3 = templateValue(message, 'roll3');
    var rolled = templateValue(message, 'roll');
    if (mode === 'normal' && rolled === null) rolled = roll1;
    if (mode === 'bonus1') rolled = roll1 !== null && roll2 !== null ? Math.min(roll1, roll2) : null;
    else if (mode === 'bonus2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.min(roll1, roll2, roll3) : null;
    else if (mode === 'penalty1') rolled = roll1 !== null && roll2 !== null ? Math.max(roll1, roll2) : null;
    else if (mode === 'penalty2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.max(roll1, roll2, roll3) : null;
    if (target === null) {
      var genericTotal = rolled;
      if (genericTotal === null && message && Array.isArray(message.inlinerolls) && message.inlinerolls.length) {
        var firstTotal = message.inlinerolls[0] && message.inlinerolls[0].results && Number(message.inlinerolls[0].results.total);
        genericTotal = isFinite(firstTotal) ? firstTotal : null;
      }
      return genericTotal === null ? null : { total: genericTotal, outcome: 'roll', outcomeLabel: OUTCOMES.roll };
    }
    if (rolled === null) return null;
    var outcome = 'failure';
    if (critical !== null && rolled <= critical) outcome = 'critical';
    else if (fumble !== null && rolled >= fumble) outcome = 'fumble';
    else if (extreme !== null && rolled <= extreme) outcome = 'extreme';
    else if (hard !== null && rolled <= hard) outcome = 'hard';
    else if (rolled <= target) outcome = 'success';
    return {
      total: rolled,
      target: target,
      hard: hard,
      extreme: extreme,
      mode: mode,
      outcome: outcome,
      outcomeLabel: OUTCOMES[outcome],
    };
  }

  function emitResult(payload, message) {
    payload.secret = !!payload.secret || !!(message &&
      (message.type === 'whisper' || message.type === 'gmrollresult'));
    var result = payload.contractId ? contractResult(message, payload) : null;
    if (result) {
      payload.result = result;
      payload.outcome = result.outcome;
      payload.outcomeLabel = result.outcomeLabel;
    }
    var automaticInsanity = payload._automaticInsanity;
    delete payload._automaticInsanity;
    if (automaticInsanity) finishAutomaticInsanity(payload, result, automaticInsanity);
    payload.message = message || null;
    if (typeof KIBScene.broadcast === 'function')
      KIBScene.broadcast('sheet:result', payload);
    else {
      var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
      var listener = cutin && cutin.events && cutin.events['sheet:result'];
      if (typeof listener === 'function') listener(payload);
    }
  }

  function prunePendingResults() {
    var cutoff = Date.now() - 30000;
    Object.keys(pendingResults).forEach(function (token) {
      if (pendingResults[token].created < cutoff) delete pendingResults[token];
    });
  }

  function messageTemplateFields(message) {
    var fields = dictionary();
    String(message && message.content || '').replace(/\{\{\s*([^={}]+?)\s*=\s*([^}]*)\}\}/g, function (token, name, value) {
      fields[trim(name).toLowerCase()] = trim(value);
      return token;
    });
    return fields;
  }

  function sourceTemplateFieldNames(raw) {
    var found = dictionary();
    String(raw || '').replace(/\{\{\s*([^={}]+?)\s*=/g, function (token, name) {
      found[trim(name).toLowerCase()] = true;
      return token;
    });
    return Object.keys(found);
  }

  function normalizedTemplateText(value) {
    return normalize(String(value == null ? '' : value).replace(/<[^>]*>/g, ' '));
  }

  function directResultCharacters(message, fields) {
    var speaking = speakingCharacter(message);
    return speaking.ok ? [speaking.character] : [];
  }

  function directInstanceScore(characterId, instance, fields) {
    var roll = instance.roll || {};
    var score = 0;
    var rejected = false;
    var hasIdentity = false;
    var matchedIdentity = false;
    (Array.isArray(roll.staticLabels) ? roll.staticLabels : []).forEach(function (entry) {
      if (rejected || !entry || typeof entry !== 'object' || !entry.field) return;
      hasIdentity = true;
      var field = trim(entry.field).toLowerCase();
      if (!own(fields, field)) return;
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(entry.value)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
      if (rejected || !ref || !ref.field) return;
      hasIdentity = true;
      var field = trim(ref.field).toLowerCase();
      if (!own(fields, field)) return;
      var expected = contractLabelRef(characterId, instance.contract, roll, instance.row, ref);
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(expected)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    if (rejected || (hasIdentity && !matchedIdentity)) return -1;
    sourceTemplateFieldNames(roll.raw).forEach(function (field) {
      if (own(fields, field)) score += 1;
    });
    var values = dictionary();
    Object.keys(fields).forEach(function (field) {
      var value = normalizedTemplateText(fields[field]);
      if (value) values[value] = true;
    });
    (instance.aliases || []).forEach(function (alias) {
      if (values[normalize(alias)]) score += 3;
    });
    return score;
  }

  function directInstanceIdentity(instance) {
    var roll = instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(roll.name),
      normalize(roll.template),
      normalize(instance.label),
      repeating && repeating.section || '',
      instance.row && instance.row.id || '',
      roll.staticLabels || [],
      roll.labelRefs || [],
    ]);
  }

  function captureDirectResult(message) {
    if (!message || !message.rolltemplate || !Array.isArray(message.inlinerolls)) return false;
    var fields = messageTemplateFields(message);
    var matches = [];
    directResultCharacters(message, fields).forEach(function (character) {
      var data = scan(character.id);
      if (!data.ok || !data.contractMatch) return;
      var instances = data.contractMatch.status === 'matched'
        ? data.contractRolls
        : actionableContractRolls(character.id, data.contractMatch, false);
      var template = normalize(message.rolltemplate);
      instances.forEach(function (instance) {
        if (normalize(instance.roll && instance.roll.template) !== template) return;
        var score = directInstanceScore(character.id, instance, fields);
        if (score > 0) matches.push({ character: character, instance: instance, score: score });
      });
    });
    if (!matches.length) return false;
    var bestScore = Math.max.apply(Math, matches.map(function (match) { return match.score; }));
    var best = matches.filter(function (match) { return match.score === bestScore; });
    var keys = dictionary();
    best.forEach(function (match) { keys[contractCutinKey(match.instance)] = true; });
    if (Object.keys(keys).length !== 1) {
      var identities = dictionary();
      best.forEach(function (match) { identities[directInstanceIdentity(match.instance)] = true; });
      if (Object.keys(identities).length !== 1) return false;
    }
    var match = best[0];
    emitResult({
      source: 'sheet',
      system: 'sheet',
      kind: match.instance.roll.kind || 'contract',
      characterId: match.character.id,
      contractId: match.instance.contract.id,
      sourceHash: match.instance.contract.sourceHash || '',
      key: match.instance.roll.key,
      label: match.instance.label,
      aliases: match.instance.aliases || [],
      cutinKey: contractCutinKey(match.instance),
      mode: '',
      modeLabel: '',
      secret: message.type === 'whisper' || message.type === 'gmrollresult',
    }, message);
    return true;
  }

  function captureResult(message) {
    var content = String((message && message.content) || '');
    var tokenMatch = content.match(/<!--\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*-->/i) ||
      content.match(/\{\{\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*\}\}/i);
    if (tokenMatch) {
      if (own(pendingResults, tokenMatch[1])) {
        var pending = pendingResults[tokenMatch[1]];
        delete pendingResults[tokenMatch[1]];
        emitResult(pending.payload, message);
      }
      return true;
    }
    return captureDirectResult(message);
  }

  function merge(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      target[key] = source[key];
    });
    return target;
  }

  function sendSheet(character, content, payload) {
    prunePendingResults();
    var token = 'k' + Date.now().toString(36) + randomInteger(1000000000).toString(36);
    pendingResults[token] = { created: Date.now(), payload: payload };
    try {
      sendChat('character|' + character.id, content + ' <!--kib_sheet_result=' + token + '-->');
      return { ok: true, payload: payload };
    } catch (err) {
      delete pendingResults[token];
      return { ok: false, error: '판정 메시지를 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function sourceContractAction(character, query, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    var resolved = resolveContractAction(character, query, secret);
    return resolved.handled
      ? resolved.result
      : { ok: false, error: '현재 시트에서 ' + trim(query) + ' 굴림을 찾지 못했습니다.' };
  }

  function sourceContractNeedsName(character) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    return { ok: false, error: '시트에서 읽은 굴림은 <code>!!굴릴항목이름</code>으로 실행해 주세요.' };
  }

  function rollCheck(characterId, query, options) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, trim(query) + (options && trim(options.mode) ? ' ' + trim(options.mode) : ''), !!(options && options.secret));
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function safeRollExpression(expression) {
    var source = trim(expression);
    if (!source || source.length > 100) return null;
    var scrubbed = source.replace(/@\{[A-Za-z0-9_$-]+(?:\|max)?\}/g, '1');
    if (scrubbed.indexOf('@{') > -1) return null;
    var withoutFunctions = scrubbed.replace(/\b(?:floor|ceil|round|min|max|abs)\b/gi, '');
    if (!/^[\d\s+dD*/().,-]+$/.test(withoutFunctions)) return null;
    var dice = scrubbed.match(/(?:\d*)d\d+/gi) || [];
    for (var i = 0; i < dice.length; i++) {
      var match = dice[i].match(/^(\d*)d(\d+)$/i);
      var count = Number(match[1] || 1);
      var sides = Number(match[2]);
      if (count < 1 || count > 100 || sides < 1 || sides > 100000) return null;
    }
    return source;
  }

  function safeUserRollExpression(characterId, expression) {
    var resolved = resolvedRollExpression(characterId, expression, [], 0, {});
    if (!resolved) return null;
    if (!/(^|[^A-Za-z0-9_])(?:\d*)d\d+([^A-Za-z0-9_]|$)/i.test(resolved)) return null;
    var source = resolved.replace(/\s+/g, '');
    var tokens = [];
    while (source) {
      var match = source.match(/^(floor|ceil|round|min|max|abs|\d*d\d+|\d+(?:\.\d+)?|[()+\-*\/,])/i);
      if (!match) return null;
      tokens.push(match[1]);
      source = source.substring(match[1].length);
    }
    var depth = 0;
    var expectingValue = true;
    var unary = false;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token)) {
        if (!expectingValue || tokens[i + 1] !== '(') return null;
        continue;
      }
      if (token === '(') {
        if (!expectingValue) return null;
        depth++;
        unary = false;
        continue;
      }
      if (token === ')') {
        if (expectingValue || depth < 1) return null;
        depth--;
        expectingValue = false;
        unary = false;
        continue;
      }
      if (token === ',') {
        if (expectingValue || depth < 1) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (/^[+\-]$/.test(token) && expectingValue) {
        if (unary) return null;
        unary = true;
        continue;
      }
      if (/^[+\-*\/]$/.test(token)) {
        if (expectingValue) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (!expectingValue) return null;
      expectingValue = false;
      unary = false;
    }
    return !expectingValue && depth === 0 ? resolved : null;
  }

  function repeatingScope(name) {
    var match = trim(name).match(/^(repeating_.+_(?:\$\d+|-[A-Za-z0-9_-]+)_)/);
    return match ? [match[1]] : [];
  }

  function expressionAttribute(characterId, name, valueType, scopes, defaults, rowContext) {
    var candidates = [];
    var rowLocal = rowContext && rowContext.fields && own(rowContext.fields, name);
    if (name.indexOf('repeating_') !== 0) {
      (scopes || []).forEach(function (scope) {
        candidates.push({ name: scope + name, scopes: scopes });
      });
    }
    if (!rowLocal) candidates.push({ name: name, scopes: repeatingScope(name) });
    for (var i = 0; i < candidates.length; i++) {
      var valueKey = candidates[i].name + '|' + valueType;
      var resolved = !rowLocal && rowContext && typeof rowContext.resolveAttribute === 'function'
        ? rowContext.resolveAttribute(candidates[i].name, valueType) : undefined;
      var value = rowLocal && rowContext.values && own(rowContext.values, valueKey)
        ? rowContext.values[valueKey]
        : rowLocal ? undefined : resolved !== undefined ? resolved
          : getAttr(characterId, candidates[i].name, valueType);
      if ((value === undefined || trim(value) === '') && defaults && own(defaults, candidates[i].name))
        value = defaults[candidates[i].name];
      if (value !== undefined && trim(value) !== '')
        return { name: candidates[i].name, value: value, scopes: candidates[i].scopes };
    }
    return null;
  }

  function resolvedRollExpression(characterId, expression, scopes, depth, trail, defaults, rowContext) {
    if ((depth || 0) > 8) return null;
    var source = trim(expression);
    if (!source) return null;
    var failed = false;
    source = source.replace(/@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g, function (match, name, valueType) {
      var found = expressionAttribute(characterId, name, valueType || 'current', scopes || [], defaults, rowContext);
      if (!found || (trail && trail[found.name])) {
        failed = true;
        return '0';
      }
      var nextTrail = dictionary();
      Object.keys(trail || {}).forEach(function (key) { nextTrail[key] = true; });
      nextTrail[found.name] = true;
      var nested = resolvedRollExpression(
        characterId,
        found.value,
        found.scopes,
        (depth || 0) + 1,
        nextTrail,
        defaults,
        rowContext,
      );
      if (!nested) {
        failed = true;
        return '0';
      }
      return '(' + nested + ')';
    });
    if (failed || source.indexOf('@{') > -1) return null;
    return safeRollExpression(source);
  }

  function rollWeapon(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function showSpell(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollArmor(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollFree(characterId, secret, expressionOverride) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = expressionOverride !== undefined
      ? executeContractExpression(character, expressionOverride, secret)
      : sourceContractNeedsName(character);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

 function contractChoice(instance, mode, secret, expression) {
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    return {
      kind: 'contract',
      characterId: instance.characterId,
      contractId: instance.contract.id,
      rollKey: instance.roll.key,
      rowId: instance.row ? instance.row.id : '',
      modeId: mode ? String(mode.id || '') : '',
      label: (instance.label || '시트 굴림') + (modeLabels.length ? ' / ' + modeLabels[0] : ''),
      secret: !!secret,
      expression: expression || '',
    };
  }

  function contractConflict(instances, secret, expression) {
    var entries = instances.slice(0, 50);
    var choices = entries.map(function (entry) {
      return contractChoice(entry.instance, entry.mode || null, secret, expression);
    });
    var counts = dictionary();
    choices.forEach(function (choice) {
      var key = normalize(choice.label);
      counts[key] = (counts[key] || 0) + 1;
    });
    var used = dictionary();
    choices.forEach(function (choice, index) {
      var key = normalize(choice.label);
      if (counts[key] < 2) return;
      used[key] = (used[key] || 0) + 1;
      choice.label += ' (선택 ' + used[key] + ')';
    });
    return {
      ok: false,
      reason: 'conflict',
      error: '시트 원본에서 맞는 실행 항목이 여러 개입니다.' + (instances.length > choices.length ? ' 먼저 50개만 표시합니다.' : ''),
      choices: choices,
    };
  }

  function replaceContractQueries(source, queries) {
    var value = source;
    var consumed = dictionary();
    (queries || []).filter(function (query) { return !!query.raw; }).sort(function (left, right) {
      return right.raw.length - left.raw.length || left.occurrence - right.occurrence;
    }).forEach(function (query) {
      var used = consumed[query.raw] || 0;
      var wanted = Math.max(1, query.occurrence - used);
      var start = 0;
      var found = -1;
      for (var index = 0; index < wanted; index++) {
        found = value.indexOf(query.raw, start);
        if (found < 0) break;
        start = found + query.raw.length;
      }
      if (found > -1) value = value.slice(0, found) + query.value + value.slice(found + query.raw.length);
      consumed[query.raw] = used + 1;
    });
    var grouped = dictionary();
    (queries || []).filter(function (query) { return !query.raw && query.name; }).forEach(function (query) {
      var key = normalize(query.name);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(query);
    });
    var seen = dictionary();
    return value.replace(/\?\{([^{}]*)\}/g, function (match, content) {
      var key = normalize(trim(content.split('|')[0]));
      seen[key] = (seen[key] || 0) + 1;
      var selected = (grouped[key] || []).filter(function (query) {
        return query.occurrence === seen[key];
      })[0];
      return selected ? selected.value : match;
    });
  }

  function qualifyContractMacro(characterId, instance, mode, expression) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    if (!raw || raw.length > 20000) return { ok: false, error: '시트의 굴림 값이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(raw)) return { ok: false, error: 'API 명령을 실행하는 시트 굴림은 대신 실행하지 않습니다.' };
    if (/(?:\{\{|<!--)\s*kib_sheet_result\s*=/i.test(raw)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (/%\{\s*(?:selected|target)\|/i.test(raw))
      return { ok: false, error: 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.' };
    if (mode && !contractOverridesValid(instance.contract, instance.roll, mode))
      return { ok: false, error: '현재 시트의 선택 방식이 굴림에 맞지 않습니다.' };
    var overrides = contractOverrides(mode);
    var expressionRefs = Array.isArray(instance.roll.expressionRefs) ? instance.roll.expressionRefs : [];
    if (expression !== undefined) {
      expressionRefs.forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) overrides[name] = expression;
      });
    }
    raw = replaceContractQueries(raw, contractQueries(mode));
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = null;
    var failed = '';
    var expansions = 0;
    function savedAttribute(name) {
      if (!savedAttributes) {
        savedAttributes = dictionary();
        (attributeObjectCache[characterId] || attrObjects(characterId)).forEach(function (attribute) {
          savedAttributes[trim(attribute.get('name'))] = attribute;
        });
      }
      return savedAttributes[name] || null;
    }
    function sourceValue(name, maximum) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var value = field && field[maximum ? 'max' : 'default'];
      if ((value === undefined || value === null || trim(value) === '') && !maximum) {
        var control = sourceControls[name] || runtimeIndex.controls[name];
        value = control && control.default;
      }
      if ((value === undefined || value === null || trim(value) === '') && !maximum && field && field.type === 'checkbox')
        value = '0';
      return value === undefined || value === null || trim(value) === '' ? null : String(value);
    }
    function missingValueError(name) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var label = field && userFacingField(field) ? fieldLabel(field, '') : '';
      var rollLabel = contractDisplayLabel(instance.label) || '선택한';
      return label && normalize(label) !== normalize(rollLabel)
        ? rollLabel + ' 굴림에 필요한 ' + label + ' 값이 비어 있습니다.'
        : rollLabel + ' 굴림에 필요한 수치가 비어 있습니다.';
    }
    function expand(fragment, depth, trail, required) {
      if (failed) return '';
      if (depth > 12) {
        failed = '시트 항목 연결이 너무 깊습니다.';
        return '';
      }
      var source = String(fragment);
      if (source.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      var expanded = source.replace(/@\{([^{}]+)\}/g, function (match, body, offset) {
        if (failed) return '';
        if (++expansions > 512) {
          failed = '시트 항목 연결이 너무 복잡합니다.';
          return '';
        }
        var parts = body.split('|').map(trim);
        var keyword = normalize(parts[0]);
        if (keyword === 'selected' || keyword === 'target') {
          failed = 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.';
          return '';
        }
        var local = parts.length === 1 || (parts.length === 2 && normalize(parts[1]) === 'max');
        if (!local) {
          failed = '현재 캐릭터 외 속성을 참조하는 롤은 실행하지 않습니다.';
          return '';
        }
        var name = parts[0];
        var maximum = parts.length === 2;
        var requiredHere = required || source.lastIndexOf('[[', offset) > source.lastIndexOf(']]', offset);
        if (!maximum && own(overrides, name)) {
          if (requiredHere && trim(overrides[name]) === '') {
            failed = missingValueError(name);
            return '';
          }
          if (trail[name]) {
            failed = '시트 항목 연결이 순환합니다: ' + name;
            return '';
          }
          var nextTrail = dictionary();
          Object.keys(trail).forEach(function (key) { nextTrail[key] = true; });
          nextTrail[name] = true;
          return expand(overrides[name], depth + 1, nextTrail, requiredHere);
        }
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var stored = savedAttribute(fullName);
        var sourceField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        var visibleDefault = !stored && sourceField && sourceField.numericCandidate &&
          !sourceField.hidden && !sourceField.readonly && !sourceField.disabled
          ? sourceValue(name, maximum) : null;
        var live = stored ? null : getAttr(characterId, fullName, maximum ? 'max' : 'current');
        var actual = stored ? stored.get(maximum ? 'max' : 'current')
          : visibleDefault !== null && !maximum
            ? contractUnsavedFieldValue(sourceField, live, visibleDefault, false)
            : live;
        if (actual !== undefined && actual !== null && trim(actual) !== '' && /@\{[^{}]+\}/.test(String(actual))) {
          var attrKey = 'attr|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[attrKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var attrTrail = dictionary();
          Object.keys(trail).forEach(function (key) { attrTrail[key] = true; });
          attrTrail[attrKey] = true;
          return expand(actual, depth + 1, attrTrail, requiredHere);
        }
        if (actual !== undefined && actual !== null && trim(actual) !== '') return String(actual);
        if (stored) {
          var savedField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
          if (savedField && savedField.type === 'checkbox') return '0';
          if (!savedField || !savedField.hidden) {
            if (requiredHere) failed = missingValueError(name);
            return '';
          }
        }
        var fallback = sourceValue(name, maximum);
        if (fallback !== null) {
          var fallbackKey = 'default|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[fallbackKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var fallbackTrail = dictionary();
          Object.keys(trail).forEach(function (key) { fallbackTrail[key] = true; });
          fallbackTrail[fallbackKey] = true;
          return expand(fallback, depth + 1, fallbackTrail, requiredHere);
        }
        if (requiredHere) failed = missingValueError(name);
        return '';
      });
      if (expanded.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      return expanded;
    }
    var content = expand(raw, 0, {}, false);
    if (failed) return { ok: false, error: failed };
    if (!content || content.length > 20000) return { ok: false, error: '확장된 시트 롤이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(content) || /%\{[^{}]+\}/.test(content))
      return { ok: false, error: '다른 능력 또는 API 명령을 불러오는 롤은 안전하게 재생할 수 없습니다.' };
    if (/(?:\{\{|<!--)\s*kib_sheet_result\s*=/i.test(content)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (content.indexOf('?{') > -1)
      return { ok: false, reason: 'query', error: '이 굴림은 시트에서 고르는 값이 더 필요합니다.' };
    return { ok: true, content: content };
  }

  function currentContractModes(characterId, instance) {
    var index = contractRuntimeIndex(instance.contract);
    var controls = index.rollControls[instance.roll.key] || index.controls;
    return (instance.modes || []).filter(function (mode) {
      var overrides = contractOverrides(mode);
      return Object.keys(overrides).every(function (name) {
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var current = getAttr(characterId, fullName);
        var control = controls[name];
        if ((current === undefined || current === null || String(current) === '') && control && own(control, 'default'))
          current = control.default;
        return current === undefined || current === null || String(current) === String(overrides[name]);
      });
    });
  }

  function executeContractInstance(character, instance, modeId, secret, expression, modeLabelOverride) {
    instance.characterId = character.id;
    var modes = instance.modes || [];
    var mode = null;
    if (modeId) {
      var matchingModes = modes.filter(function (candidate) { return String(candidate.id || '') === String(modeId); });
      if (matchingModes.length !== 1)
        return { ok: false, error: '선택한 굴림 방식이 바뀌었습니다. 항목을 다시 선택해 주세요.' };
      mode = matchingModes[0];
    }
    var qualified = qualifyContractMacro(character.id, instance, mode, expression);
    if (!qualified.ok) {
      if (qualified.reason === 'query' && !mode && modes.length) {
        var choices = currentContractModes(character.id, instance).filter(function (candidate) {
          return contractQueries(candidate).length > 0;
        });
        if (choices.length === 1)
          return executeContractInstance(character, instance, choices[0].id, secret, expression, modeLabelOverride);
        if (choices.length > 1)
          return contractConflict(choices.map(function (candidate) { return { instance: instance, mode: candidate }; }), secret, expression);
        return { ok: false, error: '현재 시트에서 같은 굴림 방식을 찾지 못했습니다.' };
      }
      return qualified;
    }
    var label = instance.label;
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    var content = qualified.content;
    var system = 'sheet';
    if (secret && !/^\s*\/(?:w|gmroll)\b/i.test(content)) content = '/w gm ' + content;
    var payload = {
      source: 'helper',
      system: system,
      kind: instance.roll.kind || 'contract',
      characterId: character.id,
      contractId: instance.contract.id,
      sourceHash: instance.contract.sourceHash || '',
      key: instance.roll.key,
      label: label,
      aliases: instance.aliases || [],
      cutinKey: contractCutinKey(instance),
      mode: mode ? String(mode.id || '') : normalize(modeLabelOverride),
      modeLabel: trim(modeLabelOverride) || modeLabels[0] || '',
      secret: !!secret,
    };
    if (/&\{\s*template\s*:/i.test(content)) return sendSheet(character, content, payload);
    try {
      sendChat('character|' + character.id, content);
      payload.resultTracking = false;
      return { ok: true, payload: payload };
    } catch (err) {
      return { ok: false, error: '시트 롤을 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function exactContractInstance(characterId, contractId, rollKey, rowId, includeHidden) {
    var inspection = inspectContracts(characterId);
    if (inspection.status !== 'matched' &&
        !(inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'))
      return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
    var allowed = inspection.status === 'matched'
      ? [inspection.contract.id]
      : (inspection.matches || []).map(function (match) { return match.id; });
    if (allowed.indexOf(String(contractId)) < 0)
      return { ok: false, error: '선택한 굴림 정보가 현재 캐릭터와 더 이상 맞지 않습니다.' };
    var matches = actionableContractRolls(characterId, inspection, !!includeHidden).filter(function (instance) {
      return String(instance.contract.id) === String(contractId) &&
        String(instance.roll.key) === String(rollKey) && String(instance.row ? instance.row.id : '') === String(rowId || '');
    });
    return matches.length === 1
      ? { ok: true, instance: matches[0] }
      : { ok: false, error: '선택한 굴림 또는 반복행이 바뀌었습니다.' };
  }

  function contractExpressionRef(characterId, instance) {
    var refs = instance && instance.roll && Array.isArray(instance.roll.expressionRefs)
      ? instance.roll.expressionRefs : [];
    if (refs.length !== 1) return '';
    var name = contractRefName(refs[0]);
    var control = contractControls(instance.contract, instance.roll).filter(function (candidate) {
      return contractControlName(candidate) === name;
    })[0];
    var type = trim(control && control.type).toLowerCase();
    if (!name || (type !== 'text' && type !== 'textarea')) return '';
    var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
    var value = getAttr(characterId, fullName);
    if ((value === undefined || value === null || String(value) === '') && control && own(control, 'default'))
      value = control.default;
    value = trim(value);
    if (value && !safeUserRollExpression(characterId, value)) return '';
    return name;
  }

  function executeContract(characterId, contractId, rollKey, rowId, modeId, secret, expressionText) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var exact = exactContractInstance(characterId, contractId, rollKey, rowId, !!modeId);
    if (!exact.ok) return exact;
    var expression;
    if (expressionText !== undefined && expressionText !== '') {
      if (!contractExpressionRef(characterId, exact.instance))
        return { ok: false, error: '선택한 굴림은 자유 주사위 식을 받지 않습니다.' };
      expression = safeUserRollExpression(characterId, expressionText);
      if (!expression) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    }
    return executeContractInstance(character, exact.instance, modeId, secret, expression);
  }

  function contractInstanceAliases(instance, compatible, primaryOnly) {
    var found = dictionary();
    var result = [];
    var labels = primaryOnly ? [instance.label,
      trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, '')] : instance.aliases || [];
    labels.forEach(function (value) {
      contractLookupKeys(value, compatible).forEach(function (key) {
        if (!found[key]) {
          found[key] = true;
          result.push(key);
        }
      });
    });
    return result;
  }

  function contractLookupKeys(value, compatible) {
    var key = normalize(value);
    if (!key) return [];
    if (compatible === false) return [key];
    var canonical = key.replace(/페널티/g, '패널티')
      .replace(/(?:주사위|dice)/g, '')
      .replace(/(\d)개/g, '$1')
      .replace(/개(?=\d)/g, '');
    return canonical === key || !canonical ? [key] : [key, canonical];
  }

  function contractModeCandidates(instance, compatible, primaryOnly) {
    var actionAliases = contractInstanceAliases(instance, compatible, primaryOnly);
    var result = [];
    (instance.modes || []).forEach(function (mode) {
      var modeAliases = [];
      contractUserModeLabels(mode).forEach(function (label) {
        modeAliases = modeAliases.concat(contractLookupKeys(label, compatible));
      });
      var combined = [];
      actionAliases.forEach(function (action) {
        modeAliases.forEach(function (modeAlias) { combined.push(action + modeAlias); });
      });
      result.push({ instance: instance, mode: mode, modeValues: modeAliases,
        exactValues: modeAliases.concat(combined), partialValues: combined });
    });
    return result;
  }

  function contractKeysMatch(values, wanted, partial) {
    return values.some(function (value) {
      return wanted.some(function (key) {
        return partial ? value.indexOf(key) > -1 : value === key;
      });
    });
  }

  function contractMatchRank(values, wanted) {
    var best = 3;
    values.forEach(function (value) {
      wanted.forEach(function (key) {
        if (value === key) best = 0;
        else if (best > 1 && value.indexOf(key) === 0) best = 1;
        else if (best > 2 && value.indexOf(key) > -1) best = 2;
      });
    });
    return best;
  }

  function closestContractActions(instances, query, includeHidden) {
    var wanted = contractLookupKeys(query, true);
    var best = 12;
    var found = [];
    instances.forEach(function (instance) {
      if (instance.hidden && !includeHidden) return;
      var rank = contractMatchRank(contractInstanceAliases(instance, true), wanted) * 4 +
        contractMatchRank(contractInstanceAliases(instance, true, true), wanted);
      if (rank < best) {
        best = rank;
        found = [instance];
      } else if (rank === best) found.push(instance);
    });
    return best < 12 ? found : [];
  }

  function uniqueContractCandidates(candidates) {
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key + '|' +
        String(candidate.mode && candidate.mode.id || '');
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractBehaviorContent(value, instance) {
    var content = String(value);
    var identityFields = dictionary();
    (instance.roll.labelRefs || []).concat(instance.roll.staticLabels || []).forEach(function (entry) {
      var field = trim(entry && entry.field);
      if (field) identityFields[field] = true;
    });
    Object.keys(identityFields).forEach(function (field) {
      var escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp('(\\{\\{\\s*' + escaped + '\\s*=)[^}]*(\\}\\})', 'gi'), '$1*$2');
    });
    return content.replace(/\[\[([\s\S]*?)\]\]/g, function (token, expression) {
      return '[[' + expression.replace(
        /(\b\d*d(?:\d+|%|f))(?:c[fs](?:[<>=]?[-+]?\d+(?:\.\d+)?)?)+/gi,
        '$1',
      ) + ']]';
    }).replace(/\r\n?/g, '\n').trim();
  }

  function contractCandidateEquivalenceKey(characterId, candidate, expression) {
    var instance = candidate.instance;
    var mode = candidate.mode || null;
    function normalized(values) {
      return (values || []).map(normalize).filter(Boolean).sort();
    }
    function qualifiedSignature(selectedMode) {
      var qualified = qualifyContractMacro(characterId, instance, selectedMode, expression);
      return qualified.ok
        ? ['ok', contractBehaviorContent(qualified.content, instance)]
        : ['error', qualified.reason || '', qualified.error || ''];
    }
    var modeSignatures = mode ? [] : (instance.modes || []).map(function (availableMode) {
      return [normalized(contractUserModeLabels(availableMode)), qualifiedSignature(availableMode)];
    }).sort(function (left, right) {
      return JSON.stringify(left).localeCompare(JSON.stringify(right));
    });
    var resultTemplate = sourceResultTemplateForContract(instance.contract, instance.roll.key);
    return JSON.stringify([
        normalize(instance.label),
        instance.row ? instance.row.id : '',
        instance.roll.kind || 'contract',
        mode ? normalized(contractUserModeLabels(mode)) : modeSignatures,
        qualifiedSignature(mode),
        resultTemplate || null,
        !!instance.hidden,
      ]);
  }

  function collapseEquivalentContractCandidates(characterId, candidates, expression) {
    if (candidates.length < 2) return candidates;
    var copies = dictionary();
    candidates = candidates.filter(function (candidate) {
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var labels = contractStaticLabels(roll);
      var labelKey = normalize(trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, ''));
      if (!labels.length || !roll.raw || !labels.some(function (label) {
        return normalize(label) === labelKey;
      })) return true;
      // 같은 행의 동일 출력/식 복제 버튼만 합치며 원본 계약과 키는 그대로 둡니다.
      var key = JSON.stringify([
        instance.contract.id, instance.row ? instance.row.id : '', roll.repeating || null,
        labelKey, labels, roll.raw, roll.refs || [], roll.expressionRefs || [], roll.modes || [],
        instance.hidden ? roll.visibility || null : null, !!instance.hidden, roll.kind || '', candidate.mode || null,
        roll.template || '',
      ]);
      if (copies[key]) return false;
      copies[key] = true;
      return true;
    });
    var firstContractId = candidates[0].instance.contract.id;
    if (candidates.every(function (candidate) {
      return candidate.instance.contract.id === firstContractId;
    })) return candidates;
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = contractCandidateEquivalenceKey(characterId, candidate, expression);
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function commonContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractRolls(characterId, inspection, objects, includeHidden, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    var groups = dictionary();
    actionableContractRolls(characterId, inspection, includeHidden, objects, readLive).forEach(function (instance) {
      var key = contractCandidateEquivalenceKey(characterId, { instance: instance });
      if (!groups[key]) groups[key] = instance;
    });
    return Object.keys(groups).map(function (key) { return groups[key]; });
  }

  function preferDirectContractActions(instances, compatible) {
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(preferDirectContractActions(grouped[id], compatible));
      });
      return result;
    }
    var direct = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') < 0;
    });
    var variants = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') > -1;
    });
    var addressable = variants.length && variants.every(function (instance) {
      return contractModeCandidates(instance, compatible).some(function (candidate) {
        return candidate.partialValues.length > 0;
      });
    });
    return direct.length && addressable ? direct : instances;
  }

  function preferLeastOverrideModes(candidates) {
    if (candidates.length < 2) return candidates;
    var minimum = dictionary();
    candidates.forEach(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      var count = Object.keys(contractOverrides(candidate.mode)).length;
      if (!own(minimum, key) || count < minimum[key]) minimum[key] = count;
    });
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      return Object.keys(contractOverrides(candidate.mode)).length === minimum[key];
    });
  }

  function contractModeContext(mode) {
    var found = dictionary();
    var labels = Array.isArray(mode && mode.labelPath)
      ? mode.labelPath
      : [mode && (mode.labelPath || mode.label)];
    labels.forEach(function (label) {
      String(label).split(/\s*(?:\|\||::|[|｜/>])\s*/).forEach(function (part) {
        var key = normalize(part);
        if (key) found[key] = true;
      });
    });
    return found;
  }

  function preferCurrentModeContext(characterId, candidates) {
    if (candidates.length < 2 || candidates.some(function (candidate) { return !candidate.mode; })) return candidates;
    function contextKey(candidate) {
      var rowId = candidate.instance.row ? candidate.instance.row.id : '';
      return candidate.instance.contract.id + '|' + candidate.instance.roll.key + '|' + rowId + '|' +
        Object.keys(contractOverrides(candidate.mode)).sort().join(',');
    }
    var sharedKey = contextKey(candidates[0]);
    if (candidates.some(function (candidate) { return contextKey(candidate) !== sharedKey; })) return candidates;
    var best = 0;
    var overrideKey = Object.keys(contractOverrides(candidates[0].mode)).sort().join(',');
    var currentModes = currentContractModes(characterId, candidates[0].instance).filter(function (mode) {
      return Object.keys(contractOverrides(mode)).sort().join(',') === overrideKey;
    });
    if (!currentModes.length) return candidates;
    var current = currentModes.map(contractModeContext);
    var ranked = candidates.map(function (candidate) {
      var wanted = contractModeContext(candidate.mode);
      var score = 0;
      current.forEach(function (currentLabels) {
        var overlap = Object.keys(wanted).filter(function (key) { return currentLabels[key]; }).length;
        if (overlap > score) score = overlap;
      });
      if (score > best) best = score;
      return { candidate: candidate, score: score };
    });
    return best ? ranked.filter(function (entry) { return entry.score === best; })
      .map(function (entry) { return entry.candidate; }) : candidates;
  }

  function contractMultipleRollRequest(query) {
    var matched = trim(query).match(
      /^(.+?)\s*((?:보너스|페널티|패널티)\s*(?:1|2|한\s*개|두\s*개)|bonus\s*[12]|penalty\s*[12])$/i,
    );
    return matched ? { base: trim(matched[1]), mode: trim(matched[2]) } : null;
  }

  function contractRollStructure(instance) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    var index = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var fields = repeating && index.fieldSections[repeating.section] || index.fieldGlobal;
    return raw.replace(/@\{([^{}|]+)\}/g, function (reference, name) {
      var field = fields[name] || index.fieldGlobal[name];
      if (!field) return reference;
      var value = instance.characterId
        ? getAttr(instance.characterId, contractRowAttr(instance.contract, instance.roll, instance.row, name)) : null;
      if (value === undefined || value === null || trim(value) === '') value = field.default;
      if (!/[&?]\{|\{\{/.test(String(value || ''))) return reference;
      var fragment = Object.assign({}, instance, { roll: Object.assign({}, instance.roll, { raw: reference }) });
      var qualified = qualifyContractMacro(instance.characterId, fragment);
      return qualified.ok ? qualified.content : reference;
    });
  }

  function contractInlineRollCount(instance) {
    var fields = dictionary();
    contractRollStructure(instance).replace(
      /\{\{\s*(roll\d*)\s*=\s*\[\[/gi,
      function (match, field) {
        fields[String(field).toLowerCase()] = true;
        return match;
      },
    );
    return Object.keys(fields).length;
  }

  function preferSingleInlineRollActions(candidates) {
    if (candidates.length < 2) return candidates;
    var groups = dictionary();
    candidates.forEach(function (candidate) {
      if (candidate.mode) return;
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var structure = contractRollStructure(instance);
      var baseRaw = structure
        .replace(/&\{template:[^}]+\}/gi, '&{template:*}')
        .replace(/\{\{\s*roll(?:[2-9]\d*)\s*=\s*\[\[[\s\S]*?\]\]\s*\}\}/gi, '')
        .replace(/\s+/g, ' ').trim();
      var key = JSON.stringify([
        instance.contract.id,
        instance.row ? instance.row.id : '',
        normalize(instance.label),
        roll.visibility || null,
        roll.repeating || null,
        (roll.refs || []).filter(function (ref) {
          return structure.indexOf('@{' + contractRefName(ref) + (ref.max ? '|max' : '') + '}') > -1;
        }),
        roll.expressionRefs || [],
        roll.modes || [],
        baseRaw,
      ]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var chosen = dictionary();
    Object.keys(groups).forEach(function (key) {
      var group = groups[key];
      var counts = group.map(function (candidate) { return contractInlineRollCount(candidate.instance); });
      var minimum = Math.min.apply(Math, counts);
      var maximum = Math.max.apply(Math, counts);
      var best = group.filter(function (candidate) {
        return contractInlineRollCount(candidate.instance) === minimum;
      });
      if (minimum < 1 || minimum === maximum || best.length !== 1) return;
      group.forEach(function (candidate) {
        chosen[candidate.instance.contract.id + '|' + candidate.instance.key] = best[0];
      });
    });
    var seen = dictionary();
    var result = [];
    candidates.forEach(function (candidate) {
      var replacement = chosen[candidate.instance.contract.id + '|' + candidate.instance.key] || candidate;
      var key = replacement.instance.contract.id + '|' + replacement.instance.key + '|' +
        String(replacement.mode && replacement.mode.id || '');
      if (seen[key]) return;
      seen[key] = true;
      result.push(replacement);
    });
    return result;
  }

  function preferVisibleContractCandidates(candidates) {
    var visible = candidates.filter(function (candidate) {
      var instance = candidate.instance || candidate;
      return !instance.hidden;
    });
    return visible.length ? visible : candidates;
  }

  function contractMultipleRollCandidates(instances, query) {
    var requested = contractMultipleRollRequest(query);
    if (!requested) return [];
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(contractMultipleRollCandidates(grouped[id], query));
      });
      return uniqueContractCandidates(result);
    }
    var matched = closestContractActions(instances, requested.base, true);
    if (!matched.length) return [];
    var wantedMode = contractLookupKeys(requested.mode, true);
    var modes = [];
    matched.forEach(function (instance) {
      modes = modes.concat(contractModeCandidates(instance, true).filter(function (candidate) {
        return contractKeysMatch(candidate.exactValues, wantedMode, false);
      }));
    });
    modes = preferLeastOverrideModes(uniqueContractCandidates(modes));
    if (modes.length) return modes;
    if (matched.length < 2) return [];
    var counts = matched.map(contractInlineRollCount);
    var maximum = Math.max.apply(Math, counts);
    var minimum = Math.min.apply(Math, counts);
    if (maximum < 2 || maximum === minimum) return [];
    return uniqueContractCandidates(matched.filter(function (instance) {
      return contractInlineRollCount(instance) === maximum;
    }).map(function (instance) { return { instance: instance, requestedMode: requested.mode }; }));
  }

  function resolveContractAction(character, query, secret, options) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: true, result: { ok: false, error: inspection.error } };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: false, result: null };
    var instances = actionableContractRolls(character.id, inspection, true).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    function exactCandidates(compatible) {
      var wanted = contractLookupKeys(query, compatible);
      var primary = instances.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible, true), wanted, false) ||
          contractModeCandidates(instance, compatible, true).some(function (candidate) {
            return contractKeysMatch(candidate.partialValues, wanted, false);
          });
      });
      var matching = primary.length ? primary : instances;
      var modes = [];
      matching.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, compatible)); });
      var exactModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(primary.length ? candidate.partialValues : candidate.exactValues, wanted, false);
      })));
      var exactActions = preferDirectContractActions(matching.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible), wanted, false);
      }), compatible);
      return preferCurrentModeContext(character.id,
        uniqueContractCandidates(exactModes.concat(exactActions.map(function (instance) { return { instance: instance }; }))));
    }
    var exact = exactCandidates(false);
    if (!exact.length) exact = exactCandidates(true);
    exact = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(exact));
    if (!contractLookupKeys(query, true).length) return { handled: false, result: null };
    if (exact.length === 1)
      return { handled: true, result: executeContractInstance(character, exact[0].instance, exact[0].mode ? exact[0].mode.id : '', secret) };
    var deferredModeConflict = exact.length > 1 && exact.every(function (candidate) { return !!candidate.mode; })
      ? exact : [];
    if (exact.length > 1 && !deferredModeConflict.length)
      return { handled: true, result: contractConflict(exact, secret) };
    var multipleRoll = collapseEquivalentContractCandidates(
      character.id,
      preferVisibleContractCandidates(contractMultipleRollCandidates(instances, query)),
    );
    if (multipleRoll.length === 1)
      return { handled: true, result: executeContractInstance(character, multipleRoll[0].instance,
        multipleRoll[0].mode ? multipleRoll[0].mode.id : '', secret, undefined, multipleRoll[0].requestedMode) };
    if (multipleRoll.length > 1) return { handled: true, result: contractConflict(multipleRoll, secret) };
    if (options && options.exactOnly) return { handled: false, result: null, inspection: inspection };
    var wanted = contractLookupKeys(query, true);
    var partialActions = preferDirectContractActions(preferVisibleContractCandidates(
      closestContractActions(instances, query),
    ), true);
    var partialActionRank = partialActions.length
      ? contractMatchRank(contractInstanceAliases(partialActions[0], true), wanted)
      : 3;
    var partial;
    if (partialActions.length) {
      partial = uniqueContractCandidates(partialActions.map(function (instance) { return { instance: instance }; }));
    } else {
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, true)); });
      var directModes = modes.filter(function (candidate) {
        return contractKeysMatch(candidate.modeValues, wanted, true);
      });
      var matchingModes = directModes.length ? directModes : modes.filter(function (candidate) {
        return contractMatchRank(candidate.partialValues, wanted) < 2;
      });
      partial = preferLeastOverrideModes(uniqueContractCandidates(matchingModes));
    }
    partial = preferCurrentModeContext(character.id, partial);
    partial = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(partial));
    if (partial.length === 1 && (!deferredModeConflict.length || partialActionRank === 1))
      return { handled: true, result: executeContractInstance(character, partial[0].instance, partial[0].mode ? partial[0].mode.id : '', secret) };
    if (deferredModeConflict.length)
      return { handled: true, result: contractConflict(deferredModeConflict, secret) };
    if (partial.length > 1) return { handled: true, result: contractConflict(partial, secret) };
    var roleNames = Object.keys(DETECTED_ROLE_LABELS).filter(function (role) {
      return (DETECTED_ROLE_LABELS[role] || []).indexOf(normalize(query)) > -1;
    });
    if (roleNames.length === 1) {
      var detected = detectedRollRole(scan(character.id), roleNames[0]);
      if (detected.item)
        return { handled: true, result: executeContractInstance(character, detected.item, '', secret) };
    }
    return { handled: false, result: null, inspection: inspection };
  }

  function executeContractExpression(character, expressionText, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous') return null;
    var safe = safeUserRollExpression(character.id, expressionText);
    if (!safe) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    var instances = actionableContractRolls(character.id, inspection, false).filter(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    }).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    if (!instances.length) return { ok: false, error: '현재 시트에는 식을 바꿔 굴릴 수 있는 항목이 없습니다.' };
    instances = collapseEquivalentContractCandidates(character.id, instances.map(function (instance) {
      return { instance: instance };
    }), safe).map(function (candidate) { return candidate.instance; });
    if (instances.length > 1)
      return contractConflict(instances.map(function (instance) { return { instance: instance }; }), secret, expressionText);
    return executeContractInstance(character, instances[0], '', secret, safe);
  }

  function sortedUnique(values) {
    var seen = dictionary();
    return (values || []).map(trim).filter(function (value) {
      var key = normalize(value);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    }).sort(function (left, right) { return left.localeCompare(right); });
  }

  var ROLL_STATUS_GROUPS = [
    { key: 'characteristic', title: '특성치' },
    { key: 'check', title: '기능 / 판정' },
    { key: 'combat', title: '무기' },
    { key: 'spell', title: '주문' },
    { key: 'madness', title: '광기' },
    { key: 'other', title: '기타 주사위' },
  ];

  function rollStatusContext(instance) {
    var roll = instance && instance.roll || {};
    var groups = [];
    var labels = contractStaticLabels(roll).concat(roll.aliases || []);
    var sourceRaw = contractRollStructure(instance);
    var structure = [roll.template].concat(sourceTemplateFieldNames(sourceRaw));
    var repeating = contractRepeating(roll);
    if (repeating && instance && instance.contract) {
      var index = contractRuntimeIndex(instance.contract);
      var fields = index.fieldSections[repeating.section] || dictionary();
      contractRollFields(instance.contract, roll, index.controls).forEach(function (name) {
        var field = fields[name];
        if (!field) return;
        groups.push(field.groupLabel);
        structure.push(field.label);
        structure = structure.concat(field.aliases || []);
      });
    }
    return {
      sourceRaw: sourceRaw,
      groups: sortedUnique(groups.map(contractDisplayLabel).filter(Boolean)),
      labels: sortedUnique(labels.map(contractDisplayLabel).filter(Boolean)),
      structure: sortedUnique(structure.map(trim).filter(Boolean)),
    };
  }

  function rollStatusMatches(labels, pattern) {
    return (labels || []).some(function (label) { return pattern.test(trim(label)); });
  }

  function rollStatusLabel(instance) {
    var roll = instance && instance.roll || {};
    var rollName = normalize(roll.name);
    var rollKey = normalize(roll.key);
    var sourceLabels = contractStaticLabels(roll).map(normalize);
    return [instance && instance.label].concat(instance && instance.aliases || []).map(contractDisplayLabel).filter(function (label) {
      var key = normalize(label);
      return key && (key !== rollName && key !== rollKey || sourceLabels.indexOf(key) > -1);
    })[0] || '';
  }

  function rollHasOutcomeStructure(item) {
    var roll = item && item.roll || {};
    var resultTemplates = item && item.contract && item.contract.resultTemplates;
    var template = resultTemplates && resultTemplates[roll.template];
    if (!template || !Array.isArray(template.rules)) return false;
    var sourceFields = dictionary();
    function addFields(raw) {
      sourceTemplateFieldNames(raw).forEach(function (name) { sourceFields[name] = true; });
    }
    addFields(item.sourceRaw || roll.raw);
    (roll.modes || []).forEach(function (mode) {
      var overrides = contractOverrides(mode);
      Object.keys(overrides).forEach(function (name) { addFields(overrides[name]); });
      contractQueries(mode).forEach(function (query) {
        addFields(query.raw);
        addFields(query.value);
      });
    });
    var matched = dictionary();
    template.rules.forEach(function (rule) {
      if (!rule || !rule.outcome) return;
      var refs = [rule.valueField];
      (rule.conditions || []).forEach(function (condition) { refs = refs.concat(condition.args || []); });
      refs.forEach(function (name) {
        name = trim(name).toLowerCase();
        if (sourceFields[name]) matched[name] = true;
      });
    });
    return Object.keys(matched).length > 1;
  }

  function rollHasPercentileThreshold(item) {
    var raw = String(item && (item.sourceRaw || item.roll && item.roll.raw) || '');
    if (!/\b(?:\d+)?d100/i.test(raw) || !/@\{[^}]+\}/.test(raw)) return false;
    return sourceTemplateFieldNames(raw).some(function (name) {
      return /(?:^|[_-])(?:stat|threshold|target|success|skill|ability|characteristic|score)(?:$|[_-])/i.test(name);
    });
  }

  function rollStatusCategory(item) {
    var structure = (item.groupLabels || []).concat(item.structureLabels || []);
    if (rollStatusMatches(structure, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(structure, /(?:주문|마법|주술|시전|spell|magic|sorcer|ritual)/i)) return 'spell';
    if (rollStatusMatches(structure, /(?:무기|전투|공격|피해|방어구|장갑|탄약|weapon|combat|attack|damage|defen[cs]e|armo(?:u)?r|ammo)/i)) return 'combat';
    if (/&\{tracker\}/i.test(String(item && item.roll && item.roll.raw || ''))) return 'other';
    var context = (item.contextLabels || []).concat([item.label]);
    if (!contractRepeating(item.roll) && (matchesDetectedRole(context, 'characteristic') ||
        rollStatusMatches(item.structureLabels, /(?:^|[_-])characteristic(?:$|[_-])/i))) return 'characteristic';
    if (rollHasOutcomeStructure(item) || rollHasPercentileThreshold(item)) return 'check';
    if (rollStatusMatches(context, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(context, /(?:주문|마법|주술|spell|magic|ritual)/i)) return 'spell';
    if (rollStatusMatches(context, /(?:무기|weapon)/i)) return 'combat';
    return 'other';
  }

  function groupedRollItems(items) {
    var groups = dictionary();
    ROLL_STATUS_GROUPS.forEach(function (group) { groups[group.key] = []; });
    (items || []).forEach(function (item) { groups[rollStatusCategory(item)].push(item); });
    return ROLL_STATUS_GROUPS.map(function (group) {
      return { key: group.key, title: group.title, items: groups[group.key] };
    });
  }

  function statusResourceItems(data) {
    return (data && data.resources || []).filter(function (item) { return item.statusResource === true; });
  }

  function rollGroupSections(items, renderItem) {
    return groupedRollItems(items).filter(function (group) { return group.items.length; }).map(function (group) {
      return section(group.title + ' ' + group.items.length + '개', group.items.map(renderItem).join(' '));
    }).join('');
  }

  function contractRollDisplayValue(data, instance) {
    var characterId = data.characterId;
    var tr = /\{\{\s*(?:[^={}]*?(?:threshold|target)[^={}]*|stat|s(?:core|uccess|kill)|ability|characteristic)\s*=\s*\[\[([\s\S]*?)\]\]\s*\}\}/i;
    var tm = String(instance.roll.raw).match(tr);
    var m = tm ? qualifyContractMacro(characterId, Object.assign({}, instance, {
      roll: Object.assign({}, instance.roll, { raw: tm[0] }),
    }), null) : null;
    if (m && m.ok) {
      var v = m.content.match(tr);
      var n = v && resolvedResourceValue(characterId, v[1].replace(/\[\[/g, '(').replace(/\]\]/g, ')'));
      if (n && n.number !== null) return n.text;
    }
    var values = [];
    var seenRefs = dictionary();
    var seenValues = dictionary();
    var ignored = dictionary();
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = data.attributeByName || dictionary();
    contractControls(instance.contract, instance.roll).forEach(function (control) {
      var name = contractControlName(control);
      if (name) ignored[name] = true;
    });
    String(instance && instance.roll && instance.roll.raw || '').replace(
      /@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g,
      function (match, name, valueType) {
        if (ignored[name]) return match;
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var refKey = fullName + '|' + (valueType || 'current');
        if (seenRefs[refKey]) return match;
        seenRefs[refKey] = true;
        var resource = data.resourcesByAttribute && data.resourcesByAttribute[fullName];
        var property = valueType === 'max' ? 'max' : 'value';
        var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        if (field && /^(?:checkbox|radio)$/i.test(trim(field.type))) return match;
        var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
        if ((fallback === undefined || fallback === null || trim(fallback) === '') && valueType !== 'max') {
          var control = sourceControls[name] || runtimeIndex.controls[name];
          fallback = control && control.default;
        }
        var stored = savedAttributes[fullName];
        var live = stored ? null : getAttr(characterId, fullName, valueType || 'current');
        var raw = resource && own(resource, property) && resource[property] !== null
          ? resource[property]
          : stored ? stored.get(valueType === 'max' ? 'max' : 'current')
            : field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled &&
              fallback !== undefined && fallback !== null && trim(fallback) !== ''
              ? contractUnsavedFieldValue(field, live, fallback, valueType === 'max') : live;
        if (raw === undefined) return match;
        var resolved = resolvedResourceValue(characterId, raw);
        if (resolved.number === null || seenValues[resolved.text]) return match;
        seenValues[resolved.text] = true;
        values.push(resolved.text);
        return match;
      },
    );
    return values.length === 1 ? values[0] : '';
  }

  function contractRollDamageText(characterId, instance) {
    var qualified = qualifyContractMacro(characterId, instance, null);
    if (!qualified.ok) return '';
    var fields = messageTemplateFields({ content: qualified.content });
    var name = Object.keys(fields).filter(function (key) {
      return /^(?:피해|damage|dmg)$/i.test(trim(key));
    })[0];
    var value = trim(name && fields[name]);
    var inline = value.match(/^\[\[([\s\S]*)\]\]$/);
    return trim(inline ? inline[1] : value);
  }

  function contractSelectionCommand(characterId, instance, count, secret) {
    return count > 1
      ? '!시트 굴림목록|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.label) + '|' + (secret ? '1' : '0')
      : '!시트 굴림선택|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.contract.id) + '|' +
        encodeURIComponent(instance.roll.key) + '|' + encodeURIComponent(instance.row ? instance.row.id : '') + '||' +
        (secret ? '1' : '0') + '|';
  }

  function recognizedRollItems(data) {
    var result = [];
    if (usableContractInspection(data.contractMatch)) {
      var rolls = preferredContractRolls(data);
      var counts = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      var seen = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (!key || seen[key]) return;
        seen[key] = true;
        result.push({
          kind: 'contract',
          label: instance.label,
          aliases: instance.aliases || [],
          value: contractRollDisplayValue(data, instance),
          modes: sortedUnique((instance.modes || []).reduce(function (labels, mode) {
            return labels.concat(contractUserModeLabels(mode));
          }, [])),
          command: contractSelectionCommand(data.characterId, instance, counts[key], false),
        });
      });
    }
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeEntries(characterId, instance) {
    var groups = dictionary();
    var candidates = contractModeCandidates(instance, true);
    var current = currentContractModes(characterId, instance);
    var context = rollStatusContext(instance);
    var category = rollStatusCategory({
      label: rollStatusLabel(instance), groupLabels: context.groups, contextLabels: context.labels,
      structureLabels: context.structure, sourceRaw: context.sourceRaw, contract: instance.contract, roll: instance.roll,
    });
    if (current.length && category === 'combat') candidates = candidates.filter(function (candidate) {
      return current.indexOf(candidate.mode) > -1 || contractUserModeLabels(candidate.mode).some(function (label) {
        return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label));
      });
    });
    candidates.forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      var parts = labels.join(' | ').split(/\s*(?:\|\||::|[|｜/>])\s*/).map(normalize).filter(Boolean);
      var key = parts.length ? parts[parts.length - 1] : trim(candidate.mode && candidate.mode.id);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var selected = [];
    Object.keys(groups).forEach(function (key) {
      selected = selected.concat(preferCurrentModeContext(characterId, groups[key]));
    });
    var result = [];
    uniqueContractCandidates(selected).forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      labels.filter(function (label) {
        var key = normalize(label);
        if (labels.some(function (other) {
          return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(other));
        }) && /^\d+\s*개(?:\s|$)/.test(label) &&
            !contractDisplayLabel(label.replace(/^\d+\s*개\s*/, ''))) return false;
        return !/(?:보너스|패널티|페널티|bonus|penalty)/i.test(key) || !labels.some(function (other) {
          var otherKey = normalize(other);
          return otherKey.indexOf(key) === 0 && /^\+?\d+(?:개)?$/.test(otherKey.slice(key.length));
        });
      }).forEach(function (label) {
        result.push({
          id: trim(candidate.mode.id), label: label,
          modifier: /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label)),
        });
      });
    });
    return result;
  }

  function statusRollIdentity(instance) {
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    var source = trim(roll.name) ? 'name:' + trim(roll.name) : 'raw:' + String(roll.raw || '');
    return JSON.stringify([
      instance && instance.contract && instance.contract.id || '',
      roll.kind || 'contract',
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
      source,
      instance && instance.modes || [],
    ]);
  }

  function statusRollLabelIdentity(instance) {
    if (!rollStatusLabel(instance)) return '';
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(rollStatusLabel(instance)),
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
    ]);
  }

  function statusRollItems(data, includeEveryInstance) {
    var result = [];
    var counts = dictionary();
    var seen = dictionary();
    var seenLabels = dictionary();
    if (!usableContractInspection(data.contractMatch)) return result;
    // 같은 행이 원본 정렬에 여러 번 있으면 유지하고, 그 행의 보조 버튼만 제외합니다.
    var instances = includeEveryInstance ? data.contractRolls : preferredContractRolls(data);
    instances.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    instances.forEach(function (instance) {
      var label = rollStatusLabel(instance);
      var key = statusRollIdentity(instance);
      if (!key) return;
      var modeEntries = statusModeEntries(data.characterId, instance);
      if (!includeEveryInstance && seen[key] &&
          (!instance.row || seen[key].roll.key !== instance.roll.key)) {
        seen[key].modeEntries = seen[key].modeEntries.concat(modeEntries);
        return;
      }
      var context = rollStatusContext(instance);
      var item = {
        label: label,
        value: contractRollDisplayValue(data, instance),
        command: contractSelectionCommand(data.characterId, instance, counts[normalize(instance.label)] || 1, false),
        modeEntries: modeEntries,
        groupLabels: context.groups,
        contextLabels: context.labels,
        structureLabels: context.structure,
        sourceRaw: context.sourceRaw,
        contract: instance.contract,
        roll: instance.roll,
      };
      if (!label && (!modeEntries.length || rollStatusCategory(item) !== 'madness')) return;
      if (rollStatusCategory(item) === 'combat')
        item.damage = contractRollDamageText(data.characterId, instance);
      if (!seen[key]) seen[key] = item;
      var labelKey = statusRollLabelIdentity(instance);
      if (labelKey && !seenLabels[labelKey]) seenLabels[labelKey] = item;
      result.push(item);
    });
    (data.contractAllRolls || []).forEach(function (instance) {
      if (!instance.hidden) return;
      var item = seen[statusRollIdentity(instance)] || seenLabels[statusRollLabelIdentity(instance)];
      if (item) item.modeEntries = item.modeEntries.concat(statusModeEntries(data.characterId, instance));
    });
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeLayout(rolls) {
    var uses = dictionary();
    (rolls || []).forEach(function (item) {
      (item.modeEntries || []).forEach(function (entry) {
        if (!entry.id) return;
        uses[entry.id] = uses[entry.id] || dictionary();
        uses[entry.id][item.roll.key] = true;
      });
    });
    var shared = dictionary();
    Object.keys(uses).forEach(function (id) {
      if (Object.keys(uses[id]).length > 1) shared[id] = true;
    });
    var diceTypes = [];
    var madnessModes = dictionary();
    var items = [];
    (rolls || []).forEach(function (item) {
      var localModes = item.damage ? ['피해 ' + item.damage] : [];
      (item.modeEntries || []).forEach(function (entry) {
        if (entry.modifier) diceTypes.push(entry.label);
        else if (!shared[entry.id]) localModes.push(entry.label);
      });
      localModes = sortedUnique(localModes);
      if (rollStatusCategory(item) === 'madness' && localModes.length) {
        localModes.forEach(function (label) {
          var key = normalize(label);
          if (madnessModes[key]) return;
          madnessModes[key] = true;
          items.push(merge(merge({}, item), {
            label: label, value: '', localModes: [], contextLabels: (item.contextLabels || []).concat(item.label),
          }));
        });
        return;
      }
      item.localModes = localModes;
      items.push(item);
    });
    return { items: items, diceTypes: sortedUnique(diceTypes) };
  }

  function itemDetailText(data, detail) {
    var value = detail && detail[1];
    if (value === undefined || value === '') return '';
    return escapeHtml(detail[0]) + ' ' + escapeHtml(resolvedResourceValue(data.characterId, value).text || '-');
  }

  function searchHtml(data, query) {
    var wanted = normalize(query);
    var items = recognizedRollItems(data).concat(statusResourceItems(data).map(function (item) {
      return {
        kind: 'resource', label: item.label, aliases: item.aliases,
        value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)), command: '',
      };
    }));
    items = items.filter(function (item) {
      return [item.label].concat(item.aliases || []).some(function (value) {
        var key = normalize(value);
        return key && (key.indexOf(wanted) > -1 || wanted.indexOf(key) > -1);
      });
    }).sort(function (left, right) { return left.label.localeCompare(right.label); });
    if (!items.length)
      return '<b>' + escapeHtml(query) + '</b>과 이름이 비슷한 항목을 찾지 못했습니다.';
    var labels = { contract: '굴림', resource: '수치' };
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / ' + escapeHtml(query) + ' 검색</b></div><table style="width:100%;border-collapse:collapse">' +
      items.map(function (item) {
        var details = (item.details || []).map(function (detail) { return itemDetailText(data, detail); }).filter(Boolean);
        return '<tr><td style="padding:7px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b> ' +
          '<span style="color:#777;font-size:11px">' + escapeHtml(labels[item.kind] || '항목') + '</span>' +
          (item.value !== '' && item.value !== undefined ? '<br><span style="color:#333">현재 ' + escapeHtml(item.value) + '</span>' : '') +
          (details.length ? '<br><span style="color:#555;font-size:11px">' + details.join(' / ') + '</span>' : '') + '</td>' +
          '<td style="padding:7px;text-align:right;white-space:nowrap">' +
          (item.command ? button('굴리기', item.command, '#111') : '') + '</td></tr>';
      }).join('') + '</table></div>';
  }

  function button(label, command, color) {
    return '<a href="' + escapeHtml(command) + '" style="display:inline-block;margin:2px 1px;padding:5px 8px;background:' +
      (color || '#53657d') + ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' + escapeHtml(label) + '</a>';
  }

  function section(title, body) {
    return '<div style="margin-top:10px;border:1px solid #111;background:#fff;color:#111"><div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">' +
      escapeHtml(title) + '</div><div style="padding:8px">' + body + '</div></div>';
  }

  function recognizedTable(items, actions) {
    return '<table style="width:100%;border-collapse:collapse"><tr>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">항목</th>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">현재값 / 방식</th>' +
      (actions ? '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:right">실행</th>' : '') + '</tr>' +
      (items || []).map(function (item) {
        var detail = [];
        if (item.value !== '' && item.value !== undefined) detail.push('<b>' + escapeHtml(item.value) + '</b>');
        if (item.localModes && item.localModes.length) detail.push(item.localModes.map(escapeHtml).join(' / '));
        return '<tr><td style="padding:6px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b></td>' +
          '<td style="padding:6px;border-bottom:1px solid #ddd">' + detail.join('<br>') + '</td>' +
          (actions ? '<td style="padding:4px 6px;border-bottom:1px solid #ddd;text-align:right;white-space:nowrap">' +
            (item.command ? button('실행', item.command, '#111') : '') + '</td>' : '') + '</tr>';
      }).join('') + '</table>';
  }

  function recognizedTablesHtml(data, actions, includeEveryInstance) {
    var layout = statusModeLayout(statusRollItems(data, includeEveryInstance));
    var groups = dictionary();
    groupedRollItems(layout.items).forEach(function (group) { groups[group.key] = group; });
    var html = '';
    ['characteristic', 'check', 'combat', 'spell', 'madness'].forEach(function (key) {
      var group = groups[key];
      if (group && group.items.length) html += section(group.title + ' ' + group.items.length + '개', recognizedTable(group.items, actions));
    });
    var statusResources = statusResourceItems(data);
    if (statusResources.length) {
      var resources = statusResources.map(function (item) {
        return {
          label: item.label,
          value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)),
        };
      });
      html += section('수치 ' + resources.length + '개', recognizedTable(resources, false));
    }
    if (groups.other && groups.other.items.length)
      html += section(groups.other.title + ' ' + groups.other.items.length + '개', recognizedTable(groups.other.items, actions));
    if (layout.diceTypes.length)
      html += section('다이스 종류 ' + layout.diceTypes.length + '개', recognizedTable(layout.diceTypes.map(function (label) {
        return { label: label, value: '' };
      }), false));
    return html;
  }

 function cutinItems() {
    var found = dictionary();
    var sourceLabels = dictionary();
    function add(item, kind, system, key, characterName) {
      if (!item || !trim(item.label)) return;
      system = system || 'sheet';
      key = key || resultKey(system, item.label);
      if (!found[key]) found[key] = {
        key: key, label: item.label, kind: kind, system: system,
        aliases: item.aliases || [], characterName: characterName || '',
        command: item.command || '', type: item.type || '',
      };
    }
    var character = profileCharacters()[0];
    if (character) {
      (scan(character.id).contractRolls || []).forEach(function (instance) {
        var key = contractCutinKey(instance);
        if (!found[key]) {
          var seenLabels = dictionary();
          sourceLabels[key] = [instance.roll.label].concat(instance.roll.aliases || [])
            .map(contractDisplayLabel).filter(function (label) {
              var labelKey = normalize(label);
              if (!labelKey || seenLabels[labelKey] || labelKey === normalize(instance.label) ||
                  labelKey === normalize(instance.roll.name) || labelKey === normalize(instance.roll.key)) return false;
              seenLabels[labelKey] = true;
              return true;
            });
        }
        add(
          { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
          instance.roll.kind || 'contract',
          'sheet',
          key,
          character.get('name'),
        );
      });
    }
    var items = Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    var counts = dictionary();
    var indexes = dictionary();
    var sourceLabelCounts = dictionary();
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      counts[labelKey] = (counts[labelKey] || 0) + 1;
      var labels = sourceLabelCounts[labelKey] || (sourceLabelCounts[labelKey] = dictionary());
      (sourceLabels[item.key] || []).forEach(function (label) {
        var key = normalize(label);
        labels[key] = (labels[key] || 0) + 1;
      });
    });
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      if (counts[labelKey] < 2) return;
      indexes[labelKey] = (indexes[labelKey] || 0) + 1;
      var sourceLabel = (sourceLabels[item.key] || []).filter(function (label) {
        return sourceLabelCounts[labelKey][normalize(label)] < counts[labelKey];
      })[0];
      item.displayLabel = item.label + ' (' + (sourceLabel ? sourceLabel + ' / ' : '') +
        (item.characterName || '항목') + ' ' + indexes[labelKey] + ')';
    });
    return items;
  }

  function managerHtml() {
    var data = initState();
    var characters = profileCharacters();
    if (!characters.some(function (character) { return character.id === data.managerCharacterId; }))
      data.managerCharacterId = characters.length ? characters[0].id : '';
    var characterButtons = characters.length
      ? characters.map(function (character) {
          return button(
            character.id === data.managerCharacterId ? '✓ ' + character.get('name') : character.get('name'),
            '!시트 현황보기|' + character.id,
            character.id === data.managerCharacterId ? '#111' : '#53657d',
          );
        }).join(' ')
      : '<span style="color:#777">' + SHEET_NOT_RECOGNIZED + '</span>';
    var trackingLabel = data.trackingMode === 'public' ? '전체 공개' : data.trackingMode === 'gm' ? 'GM만' : '끄기';
    var trackingControls = '<b>수치 변화 알림:</b> ' + trackingLabel + '<br>' +
      button('전체 공개', '!시트 변화알림|공개', data.trackingMode === 'public' ? '#111' : '#53657d') + ' ' +
      button('GM만', '!시트 변화알림|GM', data.trackingMode === 'gm' ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 변화알림|끄기', data.trackingMode === 'off' ? '#111' : '#53657d') +
      '<br><b>플레이어 권한이 없는 GM 캐릭터도 알림:</b> ' + (data.trackGmOnly ? '켜기' : '끄기') + '<br>' +
      button('켜기', '!시트 GM캐릭터알림|켜기', data.trackGmOnly ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 GM캐릭터알림|끄기', data.trackGmOnly ? '#53657d' : '#111');
    var body =
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:12px;background:#111;color:#fff"><b style="font-size:18px">🎲 시트 헬퍼 관리</b></div>' +
      section('설정', button('시트 다시 읽기', '!시트 새로고침', '#287a4b') + '<br><br>' + trackingControls) +
      section('캐릭터별 현황 보기', '<span style="color:#555;font-size:11px">API가 인식한 현재 캐릭터들 현황 모아보기</span><br>' + characterButtons);
    var viewed = data.managerCharacterId && scan(data.managerCharacterId);
    if (viewed && viewed.ok) {
      var hasContract = usableContractInspection(viewed.contractMatch);
      var issues = (viewed.warnings || []).slice();
      if (hasContract) {
        var modesIncomplete = viewed.contractRolls.some(function (instance) {
          return instance.roll && instance.roll.modesIncomplete === true;
        });
        if (modesIncomplete)
          issues.push('일부 선택 방식은 안전하게 실행할 수 없어 생략했습니다. 해당 굴림은 시트에서 직접 실행해 주세요.');
        body += recognizedTablesHtml(viewed, false);
      } else body += section('인식 결과', SHEET_NOT_RECOGNIZED);
      if (issues.length) body += section('확인할 항목', issues.map(escapeHtml).join('<br>'));
    }
    return body + '</div>';
  }

  function managerHandout() {
    var data = initState();
    var handout = getObj('handout', data.managerId) || (findObjs({ _type: 'handout', name: sheet_helper_setting.manager_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', { name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false });
    if (!handout) return null;
    data.managerId = handout.id;
    var html = managerHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.managerHash !== hash) {
      handout.set({ name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false, notes: html });
      data.managerHash = hash;
    }
    return handout;
  }

  function playerHelpHandout() {
    var data = initState();
    var handout = getObj('handout', data.playerHelpId) ||
      (findObjs({ _type: 'handout', name: sheet_helper_setting.player_help_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', {
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
      });
    if (!handout) return null;
    data.playerHelpId = handout.id;
    var html = playerHelpHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.playerHelpHash !== hash) {
      handout.set({
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
        notes: html,
      });
      data.playerHelpHash = hash;
    }
    return handout;
  }

  function simpleHash(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
  }

  function scheduleManager() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      try {
        managerHandout();
        playerHelpHandout();
        var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
        if (cutin && typeof cutin.refreshSheetControls === 'function')
          cutin.refreshSheetControls();
      } catch (err) {
        whisperGm('시트 헬퍼 관리 갱신 오류: ' + escapeHtml(err.message || err));
      }
    }, sheet_helper_setting.refresh_delay);
  }

  function openManager() {
    var handout = managerHandout();
    return handout
      ? '<a href="http://journal.roll20.net/handout/' + encodeURIComponent(handout.id) + '" style="display:inline-block;padding:5px 8px;background:#111;color:#fff;text-decoration:none;font-weight:bold">시트 헬퍼 관리 열기</a>'
      : '관리 핸드아웃을 만들지 못했습니다.';
  }

  function playerName(msg) {
    var player = getObj('player', msg.playerid);
    return player ? trim(player.get('_displayname')) : trim(msg.who).replace(/\s*\(GM\)\s*$/, '') || 'gm';
  }

  function whisper(msg, text) {
    sendChat('시트 헬퍼', '/w "' + playerName(msg).replace(/"/g, '') + '" ' + safeWhisperText(text), null, { noarchive: true });
  }

  function whisperGm(text) {
    sendChat('시트 헬퍼', '/w gm ' + safeWhisperText(text), null, { noarchive: true });
  }

  function safeWhisperText(text) {
    return String(text == null ? '' : text).replace(/@\{/g, '&#64;{');
  }

  function switchSpeaker(msg, query) {
    if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
    var player = getObj('player', msg.playerid);
    if (!player) return whisper(msg, '화자를 바꿀 플레이어 정보를 찾지 못했습니다.');
    var rawDisplayName = trim(player.get('_displayname'));
    var displayName = rawDisplayName.replace(/\s*\(GM\)\s*$/i, '');
    if (
      normalize(query) === normalize(rawDisplayName) ||
      normalize(query) === normalize(displayName) ||
      /^(?:나|본인|해제|끄기|off)$/i.test(trim(query))
    ) {
      if (player.get('speakingas')) player.set({ speakingas: '' });
      return whisper(msg, '화자: <b>' + escapeHtml(player.get('_displayname')) + '</b>');
    }
    var found = resolveCharacterName(query, characterObjects());
    if (!found.ok) return whisper(msg, escapeHtml(found.error));
    var speakingAs = 'character|' + found.character.id;
    if (player.get('speakingas') !== speakingAs) player.set({ speakingas: speakingAs });
    return whisper(msg, '화자: <b>' + escapeHtml(found.character.get('name')) + '</b>');
  }

  function helpHtml() {
    return playerHelpHtml() +
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #aaa"><b>GM 명령어</b><br>' +
      '<code>!!관리</code> 캐릭터별 인식 항목과 현재 수치 현황<br>' +
      '<code>!!점검</code> 현황에서 확인 중인 캐릭터의 인식 상태 점검<br>' +
      '<code>!!화자 이름</code> 채팅 화자 전환<br>' +
      '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀<br>' +
      '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위<br>' +
      '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함</div>';
  }

  function playerHelpHtml() {
    var character = profileCharacters()[0];
    var contractFree = !!character && scannedContractRolls(character.id, true).some(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    });
    var rows = [
      ['!!굴릴항목이름', '해당 항목을 굴립니다. 예: <code>!!관찰력</code>'],
      ['!!비밀 굴릴항목이름', '결과를 GM에게만 보냅니다. 예: <code>!!비밀 관찰력</code>'],
      ['!!굴릴항목이름 보너스/패널티개수', '보너스 또는 패널티 주사위 개수를 붙여 굴립니다. 예: <code>!!관찰력 보너스1</code>, <code>!!관찰력 패널티2</code>'],
      ['!!검색 이름', '이름이 비슷한 항목과 현재 수치를 찾아 바로 굴립니다.'],
      ['!!상태', '내 캐릭터에서 인식된 굴림과 수치를 가나다순으로 봅니다.'],
      [':수치이름+3', '내 캐릭터 수치를 바꿉니다. 예: <code>:체력-1d3</code>, <code>:마력=10</code>'],
    ];
    if (contractFree)
      rows.push(['!!r 2d6+3', '현재 시트의 자유 주사위 디자인으로 식을 굴립니다.']);
    return (
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:10px;background:#111;color:#fff"><b>시트 헬퍼 사용법</b></div>' +
      '<table style="width:100%;border-collapse:collapse">' + rows.map(function (row) {
        return '<tr><td style="width:42%;padding:7px 8px;border-bottom:1px solid #ddd;background:#f5f5f5;vertical-align:top"><code style="font-weight:bold">' +
          escapeHtml(row[0]) + '</code></td><td style="padding:7px 8px;border-bottom:1px solid #ddd;vertical-align:top">' + row[1] + '</td></tr>';
      }).join('') + '</table><div style="padding:8px 10px">' +
      button('내 상태 보기', '!!상태', '#111') + ' ' +
      button('항목 검색', '!!검색 ?{찾을 이름}', '#111') +
      '<br><span style="color:#555;font-size:11px">이름 일부가 여러 항목과 맞으면 검정 선택 버튼으로 고를 수 있습니다.</span></div></div>'
    );
  }

  function statusHtml(data) {
    var rolls = statusRollItems(data);
    var modeLayout = statusModeLayout(rolls);
    var body = '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / 시트 현황</b></div>';
    body += modeLayout.items.length ? rollGroupSections(modeLayout.items, function (item) {
      return '<span style="display:inline-block;margin:0 8px 3px 0">' + escapeHtml(item.label) +
        (item.value ? ' <b>' + escapeHtml(item.value) + '</b>' : '') +
        (item.localModes && item.localModes.length ? ' <span style="color:#555">(' + item.localModes.map(escapeHtml).join(' / ') + ')</span>' : '') + '</span>';
    }) : section('굴릴 항목', '<span style="color:#777">없음</span>');
    if (modeLayout.diceTypes.length)
      body += section('다이스 종류 ' + modeLayout.diceTypes.length + '개', modeLayout.diceTypes.map(escapeHtml).join(', '));
    var statusResources = statusResourceItems(data);
    if (statusResources.length)
      body += section('현재 수치 ' + statusResources.length + '개', statusResources.map(function (item) {
        return escapeHtml(item.label) + ' <b>' + escapeHtml(fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item))) + '</b>';
      }).join(', '));
    return body + '<div style="padding:8px 10px;color:#555;font-size:11px">항목을 좁혀 보려면 <code>!!검색 이름</code>을 입력하세요.</div></div>';
  }

  function inspectionHtml(data) {
    var recognition = data.contractMatch || {};
    var incomplete = usableContractInspection(data.contractMatch)
      ? (data.contractRolls || []).filter(function (instance) { return instance.roll && instance.roll.modesIncomplete === true; }).length
      : 0;
    var issues = (data.warnings || []).slice();
    if (incomplete) issues.push('선택 방식을 전부 안전하게 읽지 못한 굴림 ' + incomplete + '개');
    if (recognition.contractCount && !usableContractInspection(recognition))
      issues.push('설치된 시트 인식 정보가 방의 저장 항목과 일치하지 않습니다.');
    var matched = usableContractInspection(recognition);
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / GM 인식 점검</b></div>' +
      section('인식 결과', matched
        ? '<b>인식 완료</b> / 현재 캐릭터의 굴림 ' + data.contractRolls.length + '개 / 수치 ' + statusResourceItems(data).length + '개'
        : SHEET_NOT_RECOGNIZED) +
      (matched ? recognizedTablesHtml(data, false, true) : '') +
      section('확인할 항목', issues.length ? issues.map(escapeHtml).join('<br>') : '<span style="color:#287a4b">확인할 문제가 없습니다.</span>') +
      '</div>';
  }

  function reportResult(msg, result) {
    if (result && result.ok === false)
      whisper(msg, result.reason === 'conflict' && result.choices ? bangBangChoiceHtml(result.choices) : escapeHtml(result.error));
    else if (result && result.queryOnly)
      whisper(msg, '<b>' + escapeHtml(result.weapon.label) + '</b> 탄약: ' + escapeHtml(result.value === '' ? '-' : result.value));
    return result;
  }

  function withCharacter(msg, explicitId, callback) {
    var resolved = resolveCharacter(msg, explicitId);
    if (!resolved.ok) return reportResult(msg, resolved);
    return reportResult(msg, callback(resolved.character));
  }

  function uniqueResources(items) {
    var seen = dictionary();
    return (items || []).filter(function (item) {
      if (!item || seen[item.name]) return false;
      seen[item.name] = true;
      return true;
    });
  }

  function resolveResource(data, query) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '바꿀 수치 이름을 적어 주세요.' };
    var exact = uniqueResources(data.resourceAliases[wanted] || []);
    if (exact.length === 1) return { ok: true, item: exact[0] };
    var primary = exact.filter(function (item) {
      return normalize(item.label) === wanted || normalize(item.name) === wanted;
    });
    if (primary.length === 1) return { ok: true, item: primary[0] };
    if (exact.length > 1)
      return { ok: false, error: '같은 이름의 수치가 여러 개입니다: ' + exact.map(function (item) { return item.label; }).join(', ') };
    var roles = ['health', 'magicPoints', 'sanity', 'startingSanity'].filter(function (role) {
      return (DETECTED_ROLE_LABELS[role] || []).indexOf(wanted) > -1;
    });
    if (roles.length === 1) {
      var detected = detectedFieldRole(data, roles[0], 'resource');
      if (detected.item) return { ok: true, item: detected.item };
    }
    var partial = uniqueResources((data.resources || []).filter(function (item) {
      return item.aliases.some(function (alias) { return normalize(alias).indexOf(wanted) > -1; });
    }));
    if (partial.length === 1) return { ok: true, item: partial[0] };
    if (partial.length > 1)
      return { ok: false, error: '이름이 비슷한 수치가 여러 개입니다: ' + partial.map(function (item) { return item.label; }).join(', ') };
    return { ok: false, error: '현재 시트에서 ' + trim(query) + ' 수치를 찾지 못했습니다.' };
  }

  function rollAmount(expression) {
    var source = trim(expression || '');
    var dice = source.match(/^(\d*)d(\d+)$/i);
    if (!dice) {
      var fixed = Number(source);
      return isFinite(fixed) ? { ok: true, value: fixed, detail: source } : { ok: false };
    }
    var count = Number(dice[1] || 1);
    var sides = Number(dice[2]);
    if (count < 1 || count > 100 || sides < 1 || sides > 100000) return { ok: false };
    var rolls = [];
    var total = 0;
    for (var i = 0; i < count; i += 1) {
      var rolled = randomInteger(sides);
      rolls.push(rolled);
      total += rolled;
    }
    return { ok: true, value: total, detail: source + ' [' + rolls.join(', ') + ']' };
  }

  function toggleValue(value) {
    var normalized = trim(value).toLowerCase();
    if (/^(?:1|on|true)$/.test(normalized)) return true;
    if (/^(?:0|off|false|)$/.test(normalized)) return false;
    return null;
  }

  function sanityValueText(characterId, item, current, hideMaximum) {
    var data = scan(characterId);
    var sanity = detectedFieldRole(data, 'sanity', 'number');
    if (!sanity.item || sanity.item.name !== item.name) return '';
    var starting = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = starting.item && numericFieldValue(characterId, resourceRawValue(characterId, starting.item));
    var hasStarting = starting.item && starting.item.name !== item.name && startingValue > 0;
    var hasStartingField = starting.matches.length || sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return (candidate.contract.fields || []).some(function (field) {
        var labels = [field.label].concat(field.aliases || []);
        return matchesDetectedRole(labels, 'startingSanity') ||
          linkedStartingSanityField(field, sanity.item.name, labels);
      });
    });
    var text = String(current);
    if (hasStarting)
      text += ' / 시작 ' + startingValue +
        ' (' + Math.round((current / startingValue) * 100) + '%)';
    else
      text += starting.ambiguous ? ' / 시작 확인 필요' : hasStartingField ? ' / 시작 미입력' : ' / 시작 항목 없음';
    if (!hideMaximum && sanity.item.max !== null) text += ' / 최대 ' + sanity.item.max;
    return text;
  }

  function fieldValueText(characterId, item, raw, hideSanityMaximum) {
    if (item.kind === 'toggle') {
      var enabled = trim(item.onValue) ? trim(raw) === trim(item.onValue) : toggleValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var current = numericFieldValue(characterId, raw);
    if (current === null) return trim(raw);
    var sanityText = sanityValueText(characterId, item, current, hideSanityMaximum);
    if (sanityText) return sanityText;
    return item.max !== null && item.max > 0
      ? current + ' / ' + item.max + ' (' + Math.round((current / item.max) * 100) + '%)'
      : String(current);
  }

  function resourceRawValue(characterId, item) {
    if (!item) return undefined;
    if (item.attribute) return item.attribute.get('current');
    var current = getAttr(characterId, item.name);
    return current === undefined || current === null ? item.value : current;
  }

  function resourceChangeContent(character, item, before, current, detail) {
    var beforeText = fieldValueText(character.id, item, before, true);
    var currentText = fieldValueText(character.id, item, current, true);
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    var delta = beforeNumber !== null && currentNumber !== null ? currentNumber - beforeNumber : 0;
    var deltaText = !delta || item.kind === 'toggle' ? ''
      : ' <span style="color:#aaa">(' + escapeHtml(Math.abs(delta)) + (delta > 0 ? ' 증가' : ' 감소') + ')</span>';
    var detailText = detail ? '<br><span style="color:#aaa">' + escapeHtml(detail) + '</span>' : '';
    return '<span style="font-size:10px;line-height:1.35;color:#969696"><b>' + escapeHtml(character.get('name')) + ' / ' + escapeHtml(item.label) +
      '</b> <span style="color:#b8b8b8">' + escapeHtml(beforeText) + '</span> → <b>' + escapeHtml(currentText) +
      '</b>' + deltaText + detailText + '</span>';
  }

  function sendTrackedChange(character, item, before, current, detail) {
    if (item.kind === 'toggle' &&
      fieldValueText(character.id, item, before) === fieldValueText(character.id, item, current)) return false;
    var settings = initState();
    if (settings.trackingMode === 'off') return false;
    if (!settings.trackGmOnly && !hasPlayerController(character)) return false;
    var content = resourceChangeContent(character, item, before, current, detail);
    sendChat(settings.trackingMode === 'gm' ? '시트 헬퍼' : '',
      settings.trackingMode === 'gm' ? '/w gm ' + content : '/desc ' + content, null);
    return true;
  }

  function suppressKey(characterId, name) {
    return characterId + '|' + name;
  }

  function setResourceValue(characterId, item, value) {
    var text = String(value);
    if (item.radioRange && (!isFinite(value) || Math.floor(Number(value)) !== Number(value) ||
        Number(value) < item.radioRange[0] || Number(value) > item.radioRange[1]))
      return { attribute: item.attribute || null, changed: false, error: '원본 시트에 없는 숫자 선택값입니다.' };
    var attribute = item.attribute;
    if (attribute && String(attribute.get('current') == null ? '' : attribute.get('current')) === text)
      return { attribute: attribute, changed: false };
    var key = suppressKey(characterId, item.name);
    var marker = { value: text };
    suppressedAttributeChanges[key] = marker;
    setTimeout(function () {
      if (suppressedAttributeChanges[key] === marker) delete suppressedAttributeChanges[key];
    }, 5000);
    if (!attribute) {
      var initial = getAttr(characterId, item.name);
      attribute = createObj('attribute', {
        characterid: characterId,
        name: item.name,
        current: String(initial == null ? '' : initial),
      });
    }
    if (!attribute) return { attribute: null, changed: false, error: '시트 수치를 저장하지 못했습니다.' };
    if (typeof attribute.setWithWorker === 'function') attribute.setWithWorker({ current: text });
    else attribute.set('current', text);
    return { attribute: attribute, changed: true };
  }

  function trackedRawValue(characterId, item) {
    return item && item.attribute
      ? item.attribute.get('current')
      : getAttr(characterId, item && item.name);
  }

  function trackedToggleEnabled(characterId, item) {
    if (!item) return false;
    var raw = trim(trackedRawValue(characterId, item));
    return trim(item.onValue) ? raw === trim(item.onValue) : toggleValue(raw) === true;
  }

  function activateTrackedToggle(character, item, detail, notifyChange) {
    if (!item || trackedToggleEnabled(character.id, item)) return false;
    var before = trackedRawValue(character.id, item);
    var next = trim(item.onValue) || '1';
    var saved = setResourceValue(character.id, item, next);
    if (!saved.changed) return false;
    item.attribute = saved.attribute;
    if (notifyChange !== false) sendTrackedChange(character, item, before, next, detail || '자동 활성화');
    return true;
  }

  function detectedRoleProblem(character, label, detected) {
    var suffix = detected && detected.ambiguous
      ? '같은 뜻의 항목이 여러 개입니다: ' + detected.matches.map(function (item) { return item.label; }).join(', ')
      : '해당 항목을 시트에서 찾지 못했습니다.';
    whisperGm('<b>' + escapeHtml(character.get('name')) + '</b> / ' + escapeHtml(label) + ' 자동 처리 생략: ' + escapeHtml(suffix));
    return label + ' 자동 처리 생략';
  }

  function successfulOutcome(result) {
    return result && ['critical', 'extreme', 'hard', 'success'].indexOf(result.outcome) > -1;
  }

  function finishAutomaticInsanity(payload, result, automation) {
    if (!successfulOutcome(result) || !automation || !automation.temporaryName) return;
    var character = getObj('character', payload.characterId);
    if (!character) return;
    var data = scan(character.id);
    if (automation.sourceHash && !sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return automation.sourceHash === candidate.contract.sourceHash;
    })) return;
    var longItem = automation.longName && data.trackedFields[automation.longName];
    if (longItem && trackedToggleEnabled(character.id, longItem)) return;
    var temporary = data.trackedFields[automation.temporaryName];
    if (!temporary || temporary.kind !== 'toggle') return;
    if (activateTrackedToggle(character, temporary, '지능 판정 성공으로 자동 활성화')) {
      invalidate(character.id);
      scheduleManager();
    }
  }

  function applyDetectedRules(character, changedItem, before, current, scannedData) {
    var data = scannedData || scan(character.id);
    var details = [];
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    if (beforeNumber === null || currentNumber === null || currentNumber >= beforeNumber) return details;

    var health = detectedFieldRole(data, 'health', 'number');
    var healthItem = health.item || health.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedHealth = healthItem && healthItem.name === changedItem.name;
    if (changedHealth) {
      var maximum = healthItem.max;
      var canCheckMajorDamage = maximum !== null && maximum > 0;
      if (!canCheckMajorDamage)
        details.push(detectedRoleProblem(character, '최대 체력', { ambiguous: false, matches: [] }));
      var major = detectedFieldRole(data, 'majorWound', 'toggle');
      var majorActive = major.item && trackedToggleEnabled(character.id, major.item);
      if (canCheckMajorDamage && beforeNumber - currentNumber >= maximum / 2 && !majorActive) {
        if (!major.item) details.push(detectedRoleProblem(character, '중상', major));
        else if (activateTrackedToggle(character, major.item, '최대 체력의 절반 이상 피해', false)) {
          majorActive = true;
          details.push('중상 활성화');
        }
      }
      if (currentNumber <= 0 && majorActive) {
        var dying = detectedFieldRole(data, 'dying', 'toggle');
        if (!dying.item) details.push(detectedRoleProblem(character, '빈사', dying));
        else if (activateTrackedToggle(character, dying.item, '체력 0 및 중상 상태', false)) details.push('빈사 활성화');
      }
      if (details.length) {
        invalidate(character.id);
        scheduleManager();
      }
      return details;
    }

    var sanity = detectedFieldRole(data, 'sanity', 'number');
    var sanityItem = sanity.item || sanity.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedSanity = sanityItem && sanityItem.name === changedItem.name;
    if (!changedSanity) return details;
    var longInsanity = detectedFieldRole(data, 'longInsanity', 'toggle');
    if (longInsanity.ambiguous) {
      details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      return details;
    }
    var longActive = longInsanity.item && trackedToggleEnabled(character.id, longInsanity.item);
    var startingSanity = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = startingSanity.item &&
      numericFieldValue(character.id, resourceRawValue(character.id, startingSanity.item));
    var longTriggered = !longActive && startingValue !== null && startingValue > 0 &&
      startingValue - currentNumber >= startingValue / 5;
    if (longTriggered) {
      if (!longInsanity.item) details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      else if (activateTrackedToggle(character, longInsanity.item, '시작 이성의 5분의 1 이상 손실', false)) {
        details.push('장기적 광기 활성화');
        invalidate(character.id);
        scheduleManager();
      }
      longActive = true;
    }
    if (beforeNumber - currentNumber < 5) return details;
    if (longActive) return details;
    var intelligence = detectedRollRole(data, 'intelligence');
    if (!intelligence.item) {
      details.push(detectedRoleProblem(character, '지능 판정', intelligence));
      return details;
    }
    var temporary = detectedFieldRole(data, 'temporaryInsanity', 'toggle');
    if (!temporary.item) {
      details.push(detectedRoleProblem(character, '일시적 광기', temporary));
    }
    var rolled = executeContractInstance(character, intelligence.item, '', false);
    if (!rolled || !rolled.ok) {
      details.push('지능 판정을 실행하지 못함');
      return details;
    }
    if (rolled.payload && rolled.payload.resultTracking !== false) {
      rolled.payload._automaticInsanity = {
        sourceHash: rolled.payload.sourceHash || '',
        longName: longInsanity.item ? longInsanity.item.name : '',
        temporaryName: temporary.item ? temporary.item.name : '',
      };
      details.push('지능 판정 자동 실행');
    } else details.push('지능 판정은 실행했지만 결과를 자동 인식할 수 없음');
    return details;
  }

  function applyResourceChange(character, query, operator, expression) {
    var data = scan(character.id);
    var resolved = resolveResource(data, query);
    if (!resolved.ok) return resolved;
    var amount = rollAmount(expression);
    if (!amount.ok) return { ok: false, error: '변경값은 +2, -1d3, =50 형식으로 입력해 주세요.' };
    var item = resolved.item;
    var current = numericFieldValue(character.id, resourceRawValue(character.id, item));
    if (current === null) return { ok: false, error: item.label + ' 값이 숫자가 아닙니다.' };
    var next = operator === '+' ? current + amount.value : operator === '-' ? current - amount.value : amount.value;
    next = Math.round(next * 1000000) / 1000000;
    var saved = setResourceValue(character.id, item, next);
    if (saved.error) return { ok: false, error: saved.error };
    if (!saved.changed) return { ok: true, value: next, unchanged: true };
    item.attribute = saved.attribute;
    var details = amount.detail !== String(amount.value) ? [amount.detail] : [];
    details = details.concat(applyDetectedRules(character, item, current, next, data));
    sendTrackedChange(character, item, current, next, details.join(' / '));
    invalidate(character.id);
    scheduleManager();
    return { ok: true, value: next };
  }

  function handleGeneralChange(msg) {
    var content = trim(msg.content);
    if (content.charAt(0) !== ':') return false;
    var match = content.match(/^:\s*(.+?)\s*([+\-=])\s*(\d*d\d+|\d+(?:\.\d+)?)\s*$/i);
    if (!match) {
      whisper(msg, '수치 변경은 <code>:체력+3</code>, <code>:이성-1d3</code>, <code>:마력=10</code>처럼 입력해 주세요.');
      return true;
    }
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok) {
      reportResult(msg, resolved);
      return true;
    }
    reportResult(msg, applyResourceChange(resolved.character, match[1], match[2], match[3]));
    return true;
  }

 function bangBangChoiceHtml(choices) {
    var labels = { check: '판정', weapon: '무기', spell: '주문', armor: '방어구' };
    return '<b>어느 항목을 실행할까요?</b><br>' + choices.map(function (choice) {
      if (choice.kind === 'contract') {
        var contractCommand = '!시트 굴림선택|' + encodeURIComponent(choice.characterId) + '|' +
          encodeURIComponent(choice.contractId) + '|' + encodeURIComponent(choice.rollKey) + '|' +
          encodeURIComponent(choice.rowId || '') + '|' + encodeURIComponent(choice.modeId || '') + '|' +
          (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.expression || '');
        return button(choice.label || choice.rollKey, contractCommand, '#111');
      }
      var command = '!시트 선택|' + encodeURIComponent(choice.characterId) + '|' + choice.kind + '|' +
        encodeURIComponent(choice.key) + '|' + (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.mode || '');
      return button((choice.label || choice.key) + ' / ' + (labels[choice.kind] || choice.kind), command, '#111');
    }).join(' ');
  }

  function decodeCommandPart(value) {
    try {
      return { ok: true, value: decodeURIComponent(String(value == null ? '' : value)) };
    } catch (err) {
      return { ok: false, error: '선택 버튼 값이 올바르지 않습니다. 항목 이름을 다시 입력해 주세요.' };
    }
  }

  function handleLegacyAliasRoll(msg, body) {
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok || !usableContractInspection(inspectContracts(resolved.character.id))) return false;
    var contracted = resolveContractAction(resolved.character, body, false, { exactOnly: true });
    if (!contracted.handled) return false;
    reportResult(msg, contracted.result);
    return true;
  }

 function handleBangBang(msg, content) {
    var body = trim(content.substring(2));
    if (!body) {
      whisper(msg, helpHtml());
      return true;
    }
    if (safeRollExpression(body)) {
      var expressionCharacter = resolveCharacter(msg, '');
      if (expressionCharacter.ok) {
        var expressionContract = resolveContractAction(expressionCharacter.character, body, false, { exactOnly: true });
        if (expressionContract.handled) {
          reportResult(msg, expressionContract.result);
          return true;
        }
      }
      return false;
    }

    if (handleLegacyAliasRoll(msg, body)) return true;

    var search = body.match(/^검색(?:\s+(.+))?$/i);
    if (search) {
      if (!trim(search[1])) return reportResult(msg, { ok: false, error: '찾을 이름을 적어 주세요. 입력 예: !!검색 관찰' });
      handleNamespaced(msg, '!시트 검색|' + trim(search[1]));
      return true;
    }

    var tracking = body.match(/^(변화알림|추적)\s+(공개|public|show|GM|비공개|hide|끄기|해제|off)$/i);
    if (tracking) {
      handleNamespaced(msg, '!시트 변화알림|' + tracking[2]);
      return true;
    }
    var gmTracking = body.match(/^(GM캐릭터알림|GM전용추적)\s+(켜기|on|표시|show|끄기|해제|off|숨김|hide)$/i);
    if (gmTracking) {
      handleNamespaced(msg, '!시트 GM캐릭터알림|' + gmTracking[2]);
      return true;
    }

    var direct = body.match(/^(도움말|help|관리|새로고침|상태|목록|점검)$/i);
    if (direct) {
      handleNamespaced(msg, '!시트 ' + direct[1]);
      return true;
    }
    var managed = body.match(/^(화자|캐릭터|전환)\s+(.+)$/i);
    if (managed) {
      handleNamespaced(msg, '!시트 ' + managed[1] + '|' + trim(managed[2]));
      return true;
    }

    var secret = false;
    var secretMatch = body.match(/^비밀\s+(.+)$/);
    if (secretMatch) {
      secret = true;
      body = trim(secretMatch[1]);
    }

    var original = body.match(/^원본\s+(.+)$/);
    if (original) body = trim(original[1]);

    var freeExpression = body.match(/^r(?:\s+(.+))?$/i);
    if (freeExpression) {
      if (!trim(freeExpression[1]))
        return reportResult(msg, { ok: false, error: '자유 주사위 식을 적어 주세요. 입력 예: !!r 2d6+3' });
      return withCharacter(msg, '', function (character) {
        var contracted = executeContractExpression(character, freeExpression[1], secret);
        return contracted || { ok: false, error: SHEET_NOT_RECOGNIZED };
      });
    }

    return withCharacter(msg, '', function (character) {
      var contracted = resolveContractAction(character, body, secret);
      if (!contracted.handled) {
        var categorized = body.match(/^(?:판정|무기|주문|방어구)\s+(.+)$/);
        if (categorized) contracted = resolveContractAction(character, trim(categorized[1]), secret);
      }
      if (contracted.handled) return contracted.result;
      if (contracted.inspection && !usableContractInspection(contracted.inspection) && contracted.inspection.status === 'ambiguous')
        return { ok: false, error: contracted.inspection.error };
      return {
        ok: false,
        error: contracted.inspection && usableContractInspection(contracted.inspection)
          ? '현재 시트에서 ' + trim(body) + ' 굴림을 찾지 못했습니다.'
          : SHEET_NOT_RECOGNIZED,
      };
    });
  }

  function handleNamespaced(msg, content) {
    var parts = content.substring(3).split('|').map(trim);
    var action = normalize(parts.shift() || '도움말');
    if (action === '추적') action = '변화알림';
    else if (action === 'gm전용추적') action = 'gm캐릭터알림';
    if (action === '도움말' || action === 'help') return whisper(msg, helpHtml());
    if (action === '검색')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, searchHtml(checked.data, parts[0]));
        return { ok: true };
      });
    if (action === '점검') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var inspected = resolveInspectionCharacter(msg);
      if (!inspected.ok) return reportResult(msg, inspected);
      return reportResult(msg, (function (character) {
        var recognition = inspectContracts(character.id);
        if (!usableContractInspection(recognition))
          return { ok: false, error: recognition.error || SHEET_NOT_RECOGNIZED };
        whisper(msg, inspectionHtml(scan(character.id, true)));
        return { ok: true };
      })(inspected.character));
    }
    if (action === '굴림목록' || action === '계약목록') {
      var listCharacter = decodeCommandPart(parts[0]);
      var listLabel = decodeCommandPart(parts[1]);
      if (!listCharacter.ok || !listLabel.ok)
        return reportResult(msg, !listCharacter.ok ? listCharacter : listLabel);
      return withCharacter(msg, listCharacter.value, function (character) {
        var inspection = inspectContracts(character.id);
        if (!usableContractInspection(inspection))
          return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
        var matches = preferredContractRolls(scan(character.id)).filter(function (instance) {
          return normalize(instance.label) === normalize(listLabel.value);
        }).map(function (instance) {
          instance.characterId = character.id;
          return { instance: instance };
        });
        if (!matches.length) return { ok: false, error: '선택한 굴림이 바뀌었습니다. 관리 화면을 다시 열어 주세요.' };
        if (matches.length === 1) return executeContractInstance(character, matches[0].instance, '', parts[2] === '1');
        return contractConflict(matches, parts[2] === '1');
      });
    }
    if (action === '굴림선택' || action === '계약선택') {
      var contractCharacter = decodeCommandPart(parts[0]);
      var contractId = decodeCommandPart(parts[1]);
      var contractRollKey = decodeCommandPart(parts[2]);
      var contractRowId = decodeCommandPart(parts[3]);
      var contractModeId = decodeCommandPart(parts[4]);
      var contractExpression = decodeCommandPart(parts[6]);
      var invalidContractPart = [contractCharacter, contractId, contractRollKey, contractRowId, contractModeId, contractExpression]
        .filter(function (part) { return !part.ok; })[0];
      if (invalidContractPart) return reportResult(msg, invalidContractPart);
      if (!contractCharacter.value || !contractId.value || !contractRollKey.value)
        return reportResult(msg, { ok: false, error: '선택한 굴림 정보가 비어 있습니다. 항목을 다시 선택해 주세요.' });
      return withCharacter(msg, contractCharacter.value, function (character) {
        return executeContract(
          character.id,
          contractId.value,
          contractRollKey.value,
          contractRowId.value,
          contractModeId.value,
          parts[5] === '1',
          contractExpression.value,
        );
      });
    }
    if (action === '변화알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var trackingMode = normalize(parts[0]);
      if (/^(?:공개|public|show)$/.test(trackingMode)) initState().trackingMode = 'public';
      else if (/^(?:gm|비공개|hide)$/.test(trackingMode)) initState().trackingMode = 'gm';
      else if (/^(?:끄기|해제|off)$/.test(trackingMode)) initState().trackingMode = 'off';
      else return whisperGm('변화 알림은 공개, GM, 끄기 중 하나를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('수치 변화 알림: <b>' + (initState().trackingMode === 'public' ? '전체 공개' : initState().trackingMode === 'gm' ? 'GM만' : '끄기') + '</b>');
    }
    if (action === 'gm캐릭터알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var gmTracking = normalize(parts[0]);
      if (/^(?:켜기|on|표시|show)$/.test(gmTracking)) initState().trackGmOnly = true;
      else if (/^(?:끄기|해제|off|숨김|hide)$/.test(gmTracking)) initState().trackGmOnly = false;
      else return whisperGm('GM 전용 캐릭터 알림은 켜기 또는 끄기를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('플레이어 권한이 없는 GM 캐릭터 변화 알림: <b>' + (initState().trackGmOnly ? '켜기' : '끄기') + '</b>');
    }
    if (action === '관리') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      return whisperGm(openManager());
    }
    if (action === '새로고침') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      invalidate();
      initState().managerHash = '';
      managerHandout();
      return whisperGm('시트 항목을 다시 읽었습니다.');
    }
    if (action === '화자' || action === '캐릭터' || action === '전환')
      return switchSpeaker(msg, parts[0]);
    if (action === '현황보기' || action === '관리대상') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      if (!getObj('character', parts[0])) return whisperGm('캐릭터를 찾지 못했습니다.');
      initState().managerCharacterId = parts[0];
      initState().managerHash = '';
      managerHandout();
      return;
    }
    if (action === '상태' || action === '목록')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, statusHtml(checked.data));
        return { ok: true };
      });
    if (action === '판정' || action === '비밀판정')
      return withCharacter(msg, '', function (character) {
        return rollCheck(character.id, parts[0], { secret: action === '비밀판정', mode: parts[1] });
      });
    if (action === '무기' || action === '비밀무기')
      return withCharacter(msg, '', function (character) { return rollWeapon(character.id, parts[0], action === '비밀무기'); });
    if (action === '주문' || action === '비밀주문')
      return withCharacter(msg, '', function (character) { return showSpell(character.id, parts[0], action === '비밀주문'); });
    if (action === '방어구' || action === '비밀방어구')
      return withCharacter(msg, '', function (character) { return rollArmor(character.id, parts[0], action === '비밀방어구'); });
    return whisper(msg, '알 수 없는 시트 명령입니다.<br>' + helpHtml());
  }

  function handleLegacy(msg, content) {
    if (content.indexOf('!!') === 0) return handleBangBang(msg, content);
    if (content === '!s' || /^!s\s+/.test(content)) {
      var secretTarget = trim(content.substring(2));
      if (/^[\d(]/.test(secretTarget)) return false;
      withCharacter(msg, '', function (character) { return rollCheck(character.id, secretTarget, { secret: true }); });
      return true;
    }
    var match = content.match(/^!(?:atk|무기)\s+(.+)$/i);
    if (match) {
      withCharacter(msg, '', function (character) { return rollWeapon(character.id, match[1], false); });
      return true;
    }
    if (/^!(?:status|skills|기능|weapons)$/.test(content)) {
      withCharacter(msg, '', function (character) {
        whisper(msg, statusHtml(scan(character.id)));
        return { ok: true };
      });
      return true;
    }
    return false;
  }

  function contractRelevant(name) {
    var wanted = trim(name);
    if (!wanted) return false;
    var catalog = recognitionCatalog(sheetContracts());
    return !!catalog.exact[wanted] || triePrefixes(catalog.prefixes, wanted).length > 0;
  }

  function trackAttributeChange(attribute, previous, scannedData) {
    if (!attribute || !previous) return;
    var characterId = attribute.get('_characterid');
    var name = trim(attribute.get('name'));
    var current = String(attribute.get('current') == null ? '' : attribute.get('current'));
    var before = String(previous.current == null ? '' : previous.current);
    if (!characterId || before === current) return;
    var key = suppressKey(characterId, name);
    if (suppressedAttributeChanges[key]) {
      if (suppressedAttributeChanges[key].value === current) {
        delete suppressedAttributeChanges[key];
        return;
      }
      delete suppressedAttributeChanges[key];
    }
    if (!contractRelevant(name)) return;
    var data = scannedData || scan(characterId);
    var item = data.trackedFields && data.trackedFields[name];
    if (!item) return;
    item = data.resourcesByAttribute && data.resourcesByAttribute[name] || item;
    var character = getObj('character', characterId);
    if (!character) return;
    var details = applyDetectedRules(character, item, before, current, data);
    sendTrackedChange(character, item, before, current, details.join(' / '));
  }

  function cachedUntrackedToggle(characterId, name) {
    var data = cache[characterId];
    var candidates = data && sourceCandidateInspections(data.contractMatch);
    if (!candidates || !candidates.length || data.trackedFields && data.trackedFields[name]) return false;
    return candidates.every(function (candidate) {
      var field = contractRuntimeIndex(candidate.contract).fieldGlobal[name];
      return !!(field && /^(?:checkbox|radio)$/i.test(trim(field.type)));
    });
  }

  function flushAttributeChanges() {
    attributeChangeTimer = null;
    var changes = pendingAttributeOrder.map(function (key) { return pendingAttributeChanges[key]; });
    pendingAttributeChanges = {};
    pendingAttributeOrder = [];
    if (!changes.length) return;

    var allMembershipChanged = changes.some(function (change) { return change.membershipChanged; });
    var affected = {};
    changes.forEach(function (change) { affected[change.characterId] = true; });
    if (allMembershipChanged) invalidate();
    else Object.keys(affected).forEach(function (characterId) { invalidate(characterId); });

    var scanned = {};
    changes.forEach(function (change) {
      if (!change.previous || change.presentationOnly ||
        change.membershipChanged && change.previous.current === undefined) return;
      var data = scanned[change.characterId];
      if (!data) data = scanned[change.characterId] = scan(change.characterId);
      if (!data.ok || cachedUntrackedToggle(change.characterId, change.name)) return;
      trackAttributeChange(change.attribute, change.previous, data);
    });
    scheduleManager();
  }

  function onAttributeChanged(attribute, previous, membershipChanged) {
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    membershipChanged = !!membershipChanged || !!(previous && own(previous, 'name') && trim(previous.name) !== name);
    if (!characterId || (!membershipChanged && !contractRelevant(name))) return;
    var key = characterId + '|' + name;
    var pending = pendingAttributeChanges[key];
    var presentationOnly = !membershipChanged && cachedUntrackedToggle(characterId, name);
    invalidate(characterId);
    if (!pending) {
      pending = pendingAttributeChanges[key] = {
        attribute: attribute,
        previous: previous,
        membershipChanged: membershipChanged,
        presentationOnly: presentationOnly,
        characterId: characterId,
        name: name,
      };
      pendingAttributeOrder.push(key);
    } else {
      pending.attribute = attribute;
      if (!pending.previous && previous) pending.previous = previous;
      pending.membershipChanged = pending.membershipChanged || membershipChanged;
      pending.presentationOnly = pending.presentationOnly && presentationOnly;
    }
    if (attributeChangeTimer) clearTimeout(attributeChangeTimer);
    attributeChangeTimer = setTimeout(flushAttributeChanges, 25);
  }

  api.version = VERSION;
  api.scan = scan;
  api.roll = rollCheck;
  api.rollWeapon = rollWeapon;
  api.showSpell = showSpell;
  api.rollArmor = rollArmor;
  api.rollFree = rollFree;
  api.cutinItems = cutinItems;
  api.outcomes = OUTCOMES;
  api.registerContract = registerContract;
  api.sheetContracts = sheetContracts;
  api.inspectContracts = function (characterId) {
    return inspectContracts(characterId);
  };
  api.contractRolls = function (characterId) {
    return commonContractRolls(characterId, inspectContracts(characterId), false);
  };
  api.exactContractInstance = exactContractInstance;
  api.qualifyContractMacro = qualifyContractMacro;
  api.executeContract = executeContract;
  api.resolveContractAction = resolveContractAction;
  api.refresh = function () {
    invalidate();
    initState().managerHash = '';
    initState().playerHelpHash = '';
    var manager = managerHandout();
    playerHelpHandout();
    return manager;
  };

  function registerAdapter() {
    var adapter = {
      meta: { code: '10_sheet_helper.js', title: '시트 헬퍼' },
      aliases: { 시트: '', sheet: '' },
      status: function () {
        return { sheets: sheetContracts().length };
      },
      cutinItems: cutinItems,
      outcomes: function () { return OUTCOMES; },
      refresh: api.refresh,
      help: [
        '<code>!!도움말</code> PL용과 GM용 명령어 확인',
        '<code>!!굴릴항목이름</code> 현재 시트의 굴림 실행',
        '<code>!!비밀 굴릴항목이름</code> 현재 시트의 굴림을 GM에게 실행',
        '<code>!!검색 이름</code> 항목과 현재 수치 검색',
        '<code>!!상태</code> PL용 현재 시트의 항목과 수치 확인',
        '<code>:수치이름+3</code> 내 캐릭터 수치 변경',
        '<code>!!점검</code> GM용 시트 인식 점검',
        '<code>!!화자 이름</code> GM용 채팅 화자 전환',
        '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀',
        '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위 설정',
        '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함',
        '<code>!!관리</code> GM용 인식 항목 관리',
      ],
    };
    if (typeof KIBScene.register === 'function') KIBScene.register('sheet', adapter);
    else {
      KIBScene.adapters = KIBScene.adapters || {};
      KIBScene.adapters.sheet = adapter;
    }
  }

  on('ready', function () {
    if (!sheet_helper_setting.enabled) return;
    initState();
    registerAdapter();
    if (typeof KIBScene.refreshHandout === 'function') KIBScene.refreshHandout();
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    if (cutin && typeof cutin.refreshSheetControls === 'function')
      cutin.refreshSheetControls();
    scheduleManager();
  });

  on('chat:message', function (msg) {
    if (!sheet_helper_setting.enabled || !msg) return;
    try {
      if (msg.type !== 'api' && captureResult(msg)) return;
      var content = trim(msg.content);
      if (!content) return;
      if (msg.type === 'general' && handleGeneralChange(msg)) return;
      if (msg.type === 'api') {
        if (/^!시트(?:$|\s|\|)/.test(content)) return handleNamespaced(msg, content);
        if (sheet_helper_setting.legacy_commands) handleLegacy(msg, content);
      }
    } catch (err) {
      whisperGm('시트 헬퍼 오류: ' + escapeHtml(err && err.message ? err.message : err));
    }
  });

  on('add:character', function (character) {
    invalidate();
    scheduleManager();
  });
  on('destroy:character', function (character) {
    invalidate();
    if (initState().managerCharacterId === character.id) initState().managerCharacterId = '';
    scheduleManager();
  });
  on('add:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('change:attribute', function (attribute, previous) {
    onAttributeChanged(attribute, previous || null);
  });
  on('destroy:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('destroy:handout', function (handout) {
    if (initState().managerId === handout.id) {
      initState().managerId = '';
      initState().managerHash = '';
    }
    if (initState().playerHelpId === handout.id) {
      initState().playerHelpId = '';
      initState().playerHelpHash = '';
    }
  });
})(KIBSheetHelper);
